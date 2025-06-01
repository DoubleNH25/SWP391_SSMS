<<<<<<< HEAD
=======
<<<<<<< HEAD
export interface Student {
  id: number;
  fullName: string;
  age: number;
  className: string;
=======
>>>>>>> phucc
export interface SchoolClass {
  className: string;
  classRoom: string;
  quantity: number;
  students: any[] | null; 
  id: string;
  createdBy: string;
  lastUpdatedBy: string | null;
  deletedBy: string | null;
  createdTime: string; 
  lastUpdatedTime: string; 
  deletedTime: string | null;
}

export interface Student {
  id: string;
  fullName: string;
  gender: string; 
  dateOfBirth: string; 
  classId: string;
  schoolClass: SchoolClass;
  image: string | null;
}

export interface StudentCreate {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  image: File | null;
}

export interface StudentUpdate {
  fullName: string;
  gender: string;
  dateOfBirth: string;
  classId: string;
  image: File | null;
<<<<<<< HEAD
=======
>>>>>>> 396da2f (update-crud-user-student-healthprofile)
>>>>>>> phucc
}
