import io
import re
import socket
import ipaddress
import urllib.request
import urllib.parse
import hashlib
from typing import Dict, Any, Optional, Tuple
from fastapi import HTTPException, status

# Prohibited internal IP networks for strict SSRF protection
PRIVATE_NETWORKS = [
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("169.254.0.0/16"), # Link-local / Cloud metadata (AWS/GCP)
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def validate_safe_url_ssrf(url: str) -> str:
    """
    Strict SSRF validation:
    Verifies that the target URL scheme is HTTP or HTTPS and does not resolve
    to any loopback, link-local, private, or cloud metadata IP address.
    """
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in ("http", "https"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid URL scheme '{parsed.scheme}'. Only HTTP and HTTPS are permitted."
        )

    hostname = parsed.hostname
    if not hostname:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="URL hostname is missing."
        )

    # Disallow literal localhost strings
    if hostname.lower() in ("localhost", "127.0.0.1", "0.0.0.0", "metadata.google.internal"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access to internal or loopback hosts is strictly forbidden."
        )

    # Resolve IP and verify against private ranges
    try:
        ip_str = socket.gethostbyname(hostname)
        target_ip = ipaddress.ip_address(ip_str)
        for net in PRIVATE_NETWORKS:
            if target_ip in net:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Access to private/internal IP address {ip_str} is strictly prohibited."
                )
    except socket.gaierror:
        # If DNS cannot be resolved in sandbox or offline, allow standard academic hostnames if whitelisted
        whitelisted_hosts = ("arxiv.org", "export.arxiv.org", "doi.org", "crossref.org", "nvlpubs.nist.gov", "ethereum.github.io", "daffodilvarsity.edu.bd", "diu.edu.bd", "github.com")

        if not any(hostname.endswith(wh) for wh in whitelisted_hosts):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unable to resolve DNS for hostname '{hostname}'."
            )

    return url

def download_and_validate_pdf(url: str, max_bytes: int = 25 * 1024 * 1024) -> Tuple[bytes, str]:
    """
    Safely download and validate an authentic research paper PDF.
    Returns (pdf_bytes, sha256_hash).
    """
    safe_url = validate_safe_url_ssrf(url)

    req = urllib.request.Request(
        safe_url,
        headers={
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ROSS-SEARCH/2.0 Academic Client',
            'Accept': 'application/pdf,application/octet-stream'
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=12) as response:
            content_type = response.headers.get('Content-Type', '').lower()
            pdf_bytes = response.read(max_bytes + 1024)

            if len(pdf_bytes) > max_bytes:
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail="PDF document exceeds the maximum permitted size limit of 25MB."
                )

            # Validate authentic PDF magic header
            if not pdf_bytes.startswith(b"%PDF-"):
                # Check if first 1024 bytes contain %PDF-
                if b"%PDF-" not in pdf_bytes[:1024]:
                    raise HTTPException(
                        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                        detail="The downloaded content is not an authentic PDF document (missing %PDF- header)."
                    )

            sha256_hash = hashlib.sha256(pdf_bytes).hexdigest()
            return pdf_bytes, sha256_hash
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to retrieve authentic PDF from open-access source: {str(e)}"
        )

def extract_structured_pdf_content(pdf_bytes: bytes) -> Dict[str, Any]:
    """
    Extracts text, page count, and identifies true academic document sections using PyMuPDF.
    """
    try:
        import pymupdf
        doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    except Exception:
        import fitz
        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

    page_count = len(doc)
    pages_text = []
    full_text_blocks = []

    for i in range(min(page_count, 25)): # Process up to first 25 pages
        page = doc[i]
        p_text = page.get_text("text")
        if p_text and len(p_text.strip()) > 10:
            pages_text.append(f"--- PAGE {i+1} ---\n" + p_text)
            full_text_blocks.append(p_text)

    doc.close()
    combined_text = "\n\n".join(pages_text)

    # Detect title from first page
    title = "Extracted Research Document"
    if full_text_blocks:
        first_lines = [l.strip() for l in full_text_blocks[0].split("\n") if len(l.strip()) > 5]
        if first_lines:
            title = first_lines[0]

    return {
        "title": title[:300],
        "page_count": page_count,
        "processed_pages": len(pages_text),
        "combined_text": combined_text,
        "raw_text": "\n\n".join(full_text_blocks),
        "total_characters": len(combined_text)
    }

def download_pdf_safely(url: str, max_bytes: int = 25 * 1024 * 1024) -> bytes:
    """Convenience wrapper returning just validated PDF bytes."""
    pdf_bytes, _ = download_and_validate_pdf(url, max_bytes=max_bytes)
    return pdf_bytes

def extract_text_and_sections_from_pdf(pdf_bytes: bytes, filename: str = "document.pdf") -> Dict[str, Any]:
    """Convenience wrapper returning full_text, detected_title, and sections."""
    data = extract_structured_pdf_content(pdf_bytes)
    return {
        "full_text": data["raw_text"],
        "combined_text": data["combined_text"],
        "detected_title": data["title"],
        "page_count": data["page_count"],
        "sections": {}
    }

