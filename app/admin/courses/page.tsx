"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  getAllCourseEnrollments, 
  getCourses, 
  createCourse, 
  deleteCourse, 
  updateCourseVideos,
  updateCourseNotes
} from "@/app/actions";
import { 
  GraduationCap, 
  Award, 
  BookOpen, 
  Clock, 
  Loader2, 
  Plus, 
  Trash2, 
  Settings, 
  MapPin, 
  Calendar, 
  Play, 
  Video, 
  X, 
  Check,
  FileText,
  Download
} from "lucide-react";

function AdminCoursesContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"enrollments" | "manager">("enrollments");

  useEffect(() => {
    if (tabParam === "enrollments" || tabParam === "manager") {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Course Modal State
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseType, setCourseType] = useState("physical"); // physical, online
  const [coursePrice, setCoursePrice] = useState("");
  const [courseDuration, setCourseDuration] = useState("");
  const [courseImage, setCourseImage] = useState("");
  const [courseLocation, setCourseLocation] = useState("");
  const [courseSchedule, setCourseSchedule] = useState("");
  const [submittingCourse, setSubmittingCourse] = useState(false);

  // Manage Videos Modal State
  const [isVideosModalOpen, setIsVideosModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [updatingVideos, setUpdatingVideos] = useState(false);

  // Manage Notes Modal State
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedCourseForNotes, setSelectedCourseForNotes] = useState<any | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDownloadUrl, setNoteDownloadUrl] = useState("");
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [enrollRes, courseRes] = await Promise.all([
        getAllCourseEnrollments(),
        getCourses()
      ]);
      setEnrollments(enrollRes);
      setCourses(courseRes);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim() || !courseDesc.trim() || !coursePrice.trim() || !courseDuration.trim()) {
      alert("Please fill in all required fields.");
      return;
    }
    
    setSubmittingCourse(true);
    const success = await createCourse({
      title: courseTitle,
      description: courseDesc,
      type: courseType,
      price: parseFloat(coursePrice),
      duration: courseDuration,
      image: courseImage.trim() || (courseType === "physical" ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&q=80" : "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=600"),
      location: courseLocation,
      schedule: courseSchedule
    });
    setSubmittingCourse(false);

    if (success) {
      alert("Course created successfully!");
      setIsAddCourseModalOpen(false);
      // Reset fields
      setCourseTitle("");
      setCourseDesc("");
      setCoursePrice("");
      setCourseDuration("");
      setCourseImage("");
      setCourseLocation("");
      setCourseSchedule("");
      fetchData();
    } else {
      alert("Failed to create course.");
    }
  };

  const handleDeleteCourse = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This will delete all course configurations.`)) return;
    const success = await deleteCourse(id);
    if (success) {
      alert("Course deleted successfully.");
      fetchData();
    } else {
      alert("Failed to delete course.");
    }
  };

  const handleOpenVideosModal = (course: any) => {
    setSelectedCourse(course);
    setVideoTitle("");
    setVideoDuration("");
    setVideoUrl("");
    setIsVideosModalOpen(true);
  };

  const handleAddVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !videoUrl.trim()) {
      alert("Video title and URL are required.");
      return;
    }

    setUpdatingVideos(true);
    const currentVideos = Array.isArray(selectedCourse.videos) ? [...selectedCourse.videos] : [];
    const newVideo = {
      title: videoTitle.trim(),
      duration: videoDuration.trim() || "10:00",
      url: videoUrl.trim()
    };
    const updatedVideos = [...currentVideos, newVideo];

    const success = await updateCourseVideos(selectedCourse.id, updatedVideos);
    setUpdatingVideos(false);

    if (success) {
      alert("Video lesson added successfully!");
      const updatedCourse = { ...selectedCourse, videos: updatedVideos };
      setSelectedCourse(updatedCourse);
      setCourses(prev => prev.map(c => c.id === selectedCourse.id ? updatedCourse : c));
      setVideoTitle("");
      setVideoDuration("");
      setVideoUrl("");
    } else {
      alert("Failed to add video lesson.");
    }
  };

  const handleDeleteVideo = async (index: number) => {
    if (!confirm("Are you sure you want to remove this video lesson?")) return;
    
    setUpdatingVideos(true);
    const currentVideos = Array.isArray(selectedCourse.videos) ? [...selectedCourse.videos] : [];
    currentVideos.splice(index, 1);

    const success = await updateCourseVideos(selectedCourse.id, currentVideos);
    setUpdatingVideos(false);

    if (success) {
      alert("Video lesson removed successfully.");
      const updatedCourse = { ...selectedCourse, videos: currentVideos };
      setSelectedCourse(updatedCourse);
      setCourses(prev => prev.map(c => c.id === selectedCourse.id ? updatedCourse : c));
    } else {
      alert("Failed to remove video lesson.");
    }
  };

  // Notes PDF management
  const handleOpenNotesModal = (course: any) => {
    setSelectedCourseForNotes(course);
    setNoteTitle("");
    setNoteDownloadUrl("");
    setIsNotesModalOpen(true);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteDownloadUrl.trim()) {
      alert("PDF title and download URL are required.");
      return;
    }

    setUpdatingNotes(true);
    const currentNotes = Array.isArray(selectedCourseForNotes.notes) ? [...selectedCourseForNotes.notes] : [];
    const newNote = {
      title: noteTitle.trim(),
      downloadUrl: noteDownloadUrl.trim()
    };
    const updatedNotes = [...currentNotes, newNote];

    const success = await updateCourseNotes(selectedCourseForNotes.id, updatedNotes);
    setUpdatingNotes(false);

    if (success) {
      alert("PDF study material added successfully!");
      const updatedCourse = { ...selectedCourseForNotes, notes: updatedNotes };
      setSelectedCourseForNotes(updatedCourse);
      setCourses(prev => prev.map(c => c.id === selectedCourseForNotes.id ? updatedCourse : c));
      setNoteTitle("");
      setNoteDownloadUrl("");
    } else {
      alert("Failed to add study guide.");
    }
  };

  const handleDeleteNote = async (index: number) => {
    if (!confirm("Are you sure you want to remove this PDF study guide?")) return;

    setUpdatingNotes(true);
    const currentNotes = Array.isArray(selectedCourseForNotes.notes) ? [...selectedCourseForNotes.notes] : [];
    currentNotes.splice(index, 1);

    const success = await updateCourseNotes(selectedCourseForNotes.id, currentNotes);
    setUpdatingNotes(false);

    if (success) {
      alert("Study guide removed successfully.");
      const updatedCourse = { ...selectedCourseForNotes, notes: currentNotes };
      setSelectedCourseForNotes(updatedCourse);
      setCourses(prev => prev.map(c => c.id === selectedCourseForNotes.id ? updatedCourse : c));
    } else {
      alert("Failed to remove study guide.");
    }
  };

  const totalRevenue = enrollments.reduce((sum, e) => sum + e.amountPaid, 0);
  const physicalStudentsCount = enrollments.filter(e => e.courseType === "physical").length;
  const onlineStudentsCount = enrollments.filter(e => e.courseType === "online").length;

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-white">Training Center Admin Console</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Manage Repair Courses, Student Rosters, and Syllabus Videos</p>
        </div>
      </div>

      {/* Grid count stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-5 bg-[#14141b] border border-slate-850 rounded-2xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Students</div>
          <div className="text-xl font-black text-white mt-1">{enrollments.length}</div>
        </div>
        <div className="p-5 bg-[#14141b] border border-slate-850 rounded-2xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Classroom Students</div>
          <div className="text-xl font-black text-emerald-400 mt-1">{physicalStudentsCount}</div>
        </div>
        <div className="p-5 bg-[#14141b] border border-slate-850 rounded-2xl">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Online Learners</div>
          <div className="text-xl font-black text-teal-400 mt-1">{onlineStudentsCount}</div>
        </div>
        <div className="p-5 bg-[#14141b] border border-primary/20 rounded-2xl shadow-inner">
          <div className="text-[10px] text-primary font-bold uppercase tracking-wider">Training Revenue</div>
          <div className="text-xl font-black text-white mt-1">Rs. {totalRevenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Tab: Enrollments Log */}
      {activeTab === "enrollments" && (
        <div className="bg-[#14141b] border border-slate-800 rounded-3xl p-6 shadow-md">
          {enrollments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse text-slate-300">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] uppercase font-black tracking-wider text-slate-500">
                    <th className="py-3 px-2">Student Name</th>
                    <th className="py-3 px-2">Contact Details</th>
                    <th className="py-3 px-2">Program Registered</th>
                    <th className="py-3 px-2">Training Class Type</th>
                    <th className="py-3 px-2">Amount Paid</th>
                    <th className="py-3 px-2">Payment Method</th>
                    <th className="py-3 px-2">Enrollment Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-semibold">
                  {enrollments.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-900/10 transition-colors">
                      <td className="py-3 px-2 text-white font-extrabold">{e.customerName}</td>
                      <td className="py-3 px-2">
                        <div>{e.customerEmail}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{e.customerPhone}</div>
                      </td>
                      <td className="py-3 px-2 text-slate-200">{e.courseTitle}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2.5 py-0.5 rounded text-[8px] font-black uppercase ${
                          e.courseType === "physical" 
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/30" 
                            : "bg-teal-950/40 text-teal-400 border border-teal-900/30"
                        }`}>
                          {e.courseType === "physical" ? "Classroom Lab" : "Online Video"}
                        </span>
                      </td>
                      <td className="py-3 px-2 font-black text-white">Rs. {e.amountPaid.toLocaleString()}</td>
                      <td className="py-3 px-2 text-slate-400">{e.paymentMethod}</td>
                      <td className="py-3 px-2 text-slate-400">{new Date(e.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <GraduationCap className="w-12 h-12 text-slate-755 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">No students registered yet in Training Center programs.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Manage Courses */}
      {activeTab === "manager" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-black text-white">Training Center Programs</h2>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-black uppercase rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Create Course
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((c) => {
              const videoList = Array.isArray(c.videos) ? c.videos : [];
              const noteList = Array.isArray(c.notes) ? c.notes : [];
              return (
                <div key={c.id} className="bg-[#14141b] border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-750 transition-all space-y-4">
                  <div className="space-y-4">
                    
                    {/* Cover image preview inside card */}
                    {c.image && (
                      <div className="h-36 w-full rounded-2xl overflow-hidden border border-slate-850 relative shrink-0 bg-slate-900/50">
                        <img src={c.image} alt={c.title} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                            c.type === "physical" 
                              ? "bg-emerald-500 text-white" 
                              : "bg-teal-500 text-white"
                          }`}>
                            {c.type === "physical" ? "Classroom" : "Online Video"}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-extrabold text-sm text-white">{c.title}</h3>
                        <div className="text-right shrink-0">
                          <div className="text-[10px] text-slate-500 uppercase font-bold">Fee</div>
                          <div className="text-sm font-black text-primary">Rs. {c.price.toLocaleString()}</div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{c.description}</p>

                      <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-850">
                        <div>
                          <span className="text-slate-650 block uppercase font-black text-[8px]">Duration</span>
                          {c.duration}
                        </div>
                        <div>
                          <span className="text-slate-655 block uppercase font-black text-[8px]">Video Lessons</span>
                          {videoList.length} Lessons
                        </div>
                        <div>
                          <span className="text-slate-655 block uppercase font-black text-[8px]">Study PDFs</span>
                          {noteList.length} Attachments
                        </div>
                        {c.type === "physical" ? (
                          <div className="col-span-2">
                            <span className="text-slate-650 block uppercase font-black text-[8px]">Training Center Address</span>
                            {c.location || "New Road, Kathmandu"}
                          </div>
                        ) : (
                          <div className="col-span-2">
                            <span className="text-slate-650 block uppercase font-black text-[8px]">Format</span>
                            Prerecorded + Downloads
                          </div>
                        )}
                        {c.type === "physical" && c.schedule && (
                          <div className="col-span-2">
                            <span className="text-slate-650 block uppercase font-black text-[8px]">Weekly Schedule Class</span>
                            {c.schedule}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenVideosModal(c)}
                      className="flex-1 py-2 bg-slate-850 hover:bg-slate-800 text-white text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 border border-slate-800"
                    >
                      <Video className="w-3.5 h-3.5 text-primary" /> Videos ({videoList.length})
                    </button>
                    <button
                      onClick={() => handleOpenNotesModal(c)}
                      className="flex-1 py-2 bg-slate-850 hover:bg-slate-800 text-white text-[10px] font-black uppercase rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 border border-slate-800"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary" /> PDFs ({noteList.length})
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      className="p-2 bg-red-950/20 hover:bg-red-950/50 text-red-400 border border-red-900/30 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Remove Program"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal: Create Course */}
      {isAddCourseModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 text-xs">
          <div className="w-full max-w-lg bg-[#14141b] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative text-slate-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsAddCourseModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <GraduationCap className="w-5 h-5 text-primary" /> Create Training Center Program
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Publish a new learning module with images, videos & PDF manuals.</p>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4 font-semibold text-slate-400">
              <div className="space-y-1.5">
                <label>Course Title *</label>
                <input
                  type="text" required
                  placeholder="e.g. Logic Board soldering & IC restoration masterclass"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Classroom Option *</label>
                  <select
                    value={courseType}
                    onChange={(e) => setCourseType(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none text-white font-bold"
                  >
                    <option value="physical">Physical Classroom lab</option>
                    <option value="online">Online Video Course</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label>Tuition Fee (Rs.) *</label>
                  <input
                    type="number" required
                    placeholder="e.g. 15000"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Duration spec *</label>
                  <input
                    type="text" required
                    placeholder="e.g. 6 Weeks or Self-paced"
                    value={courseDuration}
                    onChange={(e) => setCourseDuration(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Course Cover Photo Image URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={courseImage}
                    onChange={(e) => setCourseImage(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              {courseType === "physical" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label>Weekly Schedule Class</label>
                    <input
                      type="text"
                      placeholder="e.g. Mon - Fri, 8:00 AM - 10:00 AM"
                      value={courseSchedule}
                      onChange={(e) => setCourseSchedule(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label>Training Center Address</label>
                    <input
                      type="text"
                      placeholder="e.g. New Road, Kathmandu"
                      value={courseLocation}
                      onChange={(e) => setCourseLocation(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label>Syllabus & Course Summary *</label>
                <textarea
                  rows={3} required
                  placeholder="Detail course contents, tools provided, learning expectations..."
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddCourseModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-bold cursor-pointer text-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingCourse}
                  className="flex-1 py-2.5 bg-primary hover:bg-primary-hover rounded-xl text-white font-bold cursor-pointer text-center flex items-center justify-center disabled:opacity-50"
                >
                  {submittingCourse ? <Loader2 className="w-4 h-4 animate-spin" /> : "Publish Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Videos */}
      {isVideosModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 text-xs">
          <div className="w-full max-w-xl bg-[#14141b] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-slate-200 max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setIsVideosModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <Video className="w-5 h-5 text-primary" /> Manage Course Videos Playlist
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Program: {selectedCourse.title}</p>
            </div>

            {/* Video List */}
            <div className="space-y-2 max-h-[30vh] overflow-y-auto border-b border-slate-800 pb-4">
              <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Current Playlist</h4>
              {Array.isArray(selectedCourse.videos) && selectedCourse.videos.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selectedCourse.videos.map((vid: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 font-semibold">
                      <div className="flex items-center gap-2 truncate">
                        <Play className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-white truncate">{idx + 1}. {vid.title}</span>
                        <span className="text-[9px] text-slate-500 shrink-0 font-bold">({vid.duration})</span>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(idx)}
                        disabled={updatingVideos}
                        className="p-1 bg-red-950/20 hover:bg-red-950/60 text-red-400 rounded transition-colors cursor-pointer"
                        title="Remove Video"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 italic">No video chapters in this course yet.</div>
              )}
            </div>

            {/* Add Video Form */}
            <form onSubmit={handleAddVideo} className="space-y-4 text-slate-400 font-semibold border-t border-slate-850 pt-2">
              <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Add New Video Lesson</h4>
              
              <div className="space-y-1.5">
                <label>Lesson Title *</label>
                <input
                  type="text" required
                  placeholder="e.g. Chapter 3: IC Reballing using Stencils"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label>Video Stream URL (MP4 source) *</label>
                  <input
                    type="text" required
                    placeholder="https://example.com/stream.mp4"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Duration *</label>
                  <input
                    type="text" required
                    placeholder="e.g. 15:40"
                    value={videoDuration}
                    onChange={(e) => setVideoDuration(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingVideos}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {updatingVideos ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add Video Lesson</>}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Manage Notes */}
      {isNotesModalOpen && selectedCourseForNotes && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-200 text-xs">
          <div className="w-full max-w-xl bg-[#14141b] border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative text-slate-200 max-h-[85vh] overflow-y-auto">
            <button 
              onClick={() => setIsNotesModalOpen(false)}
              className="absolute right-4 top-4 text-slate-500 hover:text-white cursor-pointer"
            >
              ✕
            </button>
            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                <BookOpen className="w-5 h-5 text-primary" /> Manage Course Study Guides (PDFs)
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase">Program: {selectedCourseForNotes.title}</p>
            </div>

            {/* Notes List */}
            <div className="space-y-2 max-h-[30vh] overflow-y-auto border-b border-slate-800 pb-4">
              <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Current Attachments</h4>
              {Array.isArray(selectedCourseForNotes.notes) && selectedCourseForNotes.notes.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {selectedCourseForNotes.notes.map((note: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between gap-4 font-semibold font-sans">
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                        <span className="text-white truncate">{idx + 1}. {note.title}</span>
                      </div>
                      <button
                        onClick={() => handleDeleteNote(idx)}
                        disabled={updatingNotes}
                        className="p-1 bg-red-950/20 hover:bg-red-950/60 text-red-400 rounded transition-colors cursor-pointer"
                        title="Remove Study Material"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500 italic font-medium">No PDF study guides in this course yet.</div>
              )}
            </div>

            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="space-y-4 text-slate-400 font-semibold border-t border-slate-850 pt-2">
              <h4 className="text-[10px] text-slate-500 uppercase font-black tracking-wider">Add New Study Material (PDF)</h4>
              
              <div className="space-y-1.5">
                <label>Document Title *</label>
                <input
                  type="text" required
                  placeholder="e.g. Mobile Motherboard Circuit Diagram Manual.pdf"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label>PDF Document URL *</label>
                <input
                  type="text" required
                  placeholder="https://example.com/materials/schematics.pdf"
                  value={noteDownloadUrl}
                  onChange={(e) => setNoteDownloadUrl(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl outline-none focus:border-primary text-white"
                />
              </div>

              <button
                type="submit"
                disabled={updatingNotes}
                className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {updatingNotes ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4" /> Add PDF Document</>}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    }>
      <AdminCoursesContent />
    </Suspense>
  );
}
