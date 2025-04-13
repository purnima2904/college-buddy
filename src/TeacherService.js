// Simulated data service for teacher information
const TeacherService = {
    // Get all teachers
    getTeachers: () => {
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      return teachers;
    },
  
    // Get a specific teacher by ID or email
    getTeacher: (id) => {
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      return teachers.find(teacher => teacher.id === id || teacher.email === id);
    },
  
    // Add a new teacher
    addTeacher: (teacherData) => {
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const newTeacher = {
        ...teacherData,
        id: Date.now().toString(),
        available: true,
        timetable: [] // Default empty timetable
      };
      
      teachers.push(newTeacher);
      localStorage.setItem('teachers', JSON.stringify(teachers));
      return newTeacher;
    },
  
    // Update a teacher's information
    updateTeacher: (teacherId, updatedData) => {
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const index = teachers.findIndex(t => t.id === teacherId || t.email === teacherId);
      
      if (index !== -1) {
        teachers[index] = { ...teachers[index], ...updatedData };
        localStorage.setItem('teachers', JSON.stringify(teachers));
        return teachers[index];
      }
      
      return null;
    },
  
    // Toggle teacher availability
    toggleAvailability: (teacherId) => {
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const index = teachers.findIndex(t => t.id === teacherId || t.email === teacherId);
      
      if (index !== -1) {
        teachers[index].available = !teachers[index].available;
        localStorage.setItem('teachers', JSON.stringify(teachers));
        return teachers[index];
      }
      
      return null;
    },
  
    // Update teacher timetable
    updateTimetable: (teacherId, timetable) => {
      const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
      const index = teachers.findIndex(t => t.id === teacherId || t.email === teacherId);
      
      if (index !== -1) {
        teachers[index].timetable = timetable;
        localStorage.setItem('teachers', JSON.stringify(teachers));
        return teachers[index];
      }
      
      return null;
    },

updateTimetableImage(email, imageData) {
  // Find the teacher by email
  const teacherIndex = this.teachers.findIndex(teacher => teacher.email === email);
  
  if (teacherIndex !== -1) {
    // Update the timetable image
    this.teachers[teacherIndex].timetableImage = imageData;
    
    // If you're using localStorage to persist data
    this.saveTeachersToStorage();
    
    return this.teachers[teacherIndex];
  }
  
  return null;
}
    
  };
  
  export default TeacherService;