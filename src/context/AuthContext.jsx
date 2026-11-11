import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_SUPERVISORS, INITIAL_STUDENTS, INITIAL_TEAMS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Current active role: 'student', 'supervisor', 'admin'
  const [currentUserRole, setCurrentUserRole] = useState(() => {
    return localStorage.getItem('ross_role') || 'student';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('ross_auth') === 'true';
  });

  // User Profile (Strict rule: NO hardcoded real personal data, neutral empty image by default)
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('ross_student_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: "Student Candidate",
      studentId: "211-15-XXXX",
      department: "Department of Computer Science and Engineering",
      email: "student.candidate@s.diu.edu.bd",
      phone: "+880 1XXXXXXXXX",
      section: "60_A",
      batch: "60th Batch",
      interests: ["Machine Learning", "Data Science", "Cyber Security", "AI & Robotics"],
      preferredDomain: "Machine Learning",
      projectTitle: "Predictive Analytics Framework for Academic Performance",
      profileImage: null, // neutral empty state placeholder by default!
      bio: "Undergraduate researcher focused on artificial intelligence, distributed data structures, and computer science engineering."
    };
  });

  const [supervisorProfile, setSupervisorProfile] = useState(() => {
    const saved = localStorage.getItem('ross_supervisor_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: "Dr. Full Name",
      designation: "Professor",
      department: "Department of CSE",
      email: "supervisor.faculty@diu.edu.bd",
      phone: "+880 1XXXXXXXXX",
      room: "Room 602, Academic Building 4",
      expertise: ["Machine Learning", "Data Science", "Cyber Security", "AI & Robotics", "Data Analytics"],
      about: "A dedicated researcher in the field of Machine Learning and Artificial Intelligence, with numerous publications in top-tier journals.",
      profileImage: null, // neutral empty state placeholder by default!
      availableSlots: 2,
      maxSlots: 5,
      education: "Ph.D. in Computer Science & Engineering"
    };
  });

  // State for Teams, Supervisors, and Students
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('ross_teams');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_TEAMS;
  });

  const [supervisors, setSupervisors] = useState(() => {
    const saved = localStorage.getItem('ross_supervisors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SUPERVISORS;
  });

  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('ross_students');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_STUDENTS;
  });

  // Sync with localStorage
  useEffect(() => {
    localStorage.setItem('ross_role', currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem('ross_auth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('ross_student_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('ross_supervisor_profile', JSON.stringify(supervisorProfile));
  }, [supervisorProfile]);

  useEffect(() => {
    localStorage.setItem('ross_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('ross_supervisors', JSON.stringify(supervisors));
  }, [supervisors]);

  // Auth operations
  const login = (email, password, role = 'student') => {
    setCurrentUserRole(role);
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const switchRole = (newRole) => {
    setCurrentUserRole(newRole);
  };

  // Profile operations
  const updateStudentProfile = (updatedFields) => {
    setStudentProfile(prev => ({ ...prev, ...updatedFields }));
  };

  const updateSupervisorProfile = (updatedFields) => {
    setSupervisorProfile(prev => ({ ...prev, ...updatedFields }));
  };

  // Team operations
  const createTeam = (newTeamData) => {
    const team = {
      id: `team-${Date.now()}`,
      membersCount: 1,
      maxMembers: 5,
      status: "In Formation",
      members: [
        {
          id: "stu-current",
          name: studentProfile.name,
          studentId: studentProfile.studentId,
          role: "Leader",
          department: studentProfile.department
        }
      ],
      ...newTeamData
    };
    setTeams(prev => [team, ...prev]);
    return team;
  };

  const addTeamMember = (teamId, student) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        if (t.members.some(m => m.id === student.id)) return t;
        const updatedMembers = [...t.members, {
          id: student.id,
          name: student.name,
          studentId: student.studentId,
          role: "Member",
          department: student.department
        }];
        return {
          ...t,
          members: updatedMembers,
          membersCount: updatedMembers.length
        };
      }
      return t;
    }));
  };

  const removeTeamMember = (teamId, memberId) => {
    setTeams(prev => prev.map(t => {
      if (t.id === teamId) {
        const updatedMembers = t.members.filter(m => m.id !== memberId);
        return {
          ...t,
          members: updatedMembers,
          membersCount: updatedMembers.length
        };
      }
      return t;
    }));
  };

  const deleteTeam = (teamId) => {
    setTeams(prev => prev.filter(t => t.id !== teamId));
  };

  return (
    <AuthContext.Provider value={{
      currentUserRole,
      isAuthenticated,
      login,
      logout,
      switchRole,
      studentProfile,
      updateStudentProfile,
      supervisorProfile,
      updateSupervisorProfile,
      teams,
      createTeam,
      addTeamMember,
      removeTeamMember,
      deleteTeam,
      supervisors,
      setSupervisors,
      students,
      setStudents
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

