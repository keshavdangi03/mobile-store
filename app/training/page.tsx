"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCourses, createCourseEnrollment } from "@/app/actions";
import { 
  BookOpen, 
  Video, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  Clock, 
  Award,
  Layers,
  ChevronRight
} from "lucide-react";

export default function TrainingPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  
  // Checkout Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // card, wallet, cash
  const [submittingEnrollment, setSubmittingEnrollment] = useState(false);

  // Card details mock state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    getCourses().then((data) => {
      setCourses(data);
      setLoading(false);
    });

    // Prefill user details from session if logged in
    const session = localStorage.getItem("customer_session");
    if (session) {
      const user = JSON.parse(session);
      setFullName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, []);

  const handleEnrollClick = (course: any) => {
    // Check if authenticated, if not redirect to login
    const session = localStorage.getItem("customer_session");
    if (!session) {
      router.push(`/login?redirect=/training`);
      return;
    }
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      alert("Please fill in all details.");
      return;
    }

    if (paymentMethod === "card" && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      alert("Please fill in credit card details.");
      return;
    }

    setSubmittingEnrollment(true);

    const enrollmentData = {
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      courseType: selectedCourse.type,
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      amountPaid: selectedCourse.price,
      paymentMethod: paymentMethod === "card" ? "Credit/Debit Card" : paymentMethod === "wallet" ? "Mobile Wallet" : "Cash on Center"
    };

    createCourseEnrollment(enrollmentData).then((success) => {
      setSubmittingEnrollment(false);
      if (success) {
        setIsModalOpen(false);
        alert(`Congratulations! You have successfully enrolled in ${selectedCourse.title}. Redirecting to your account courses...`);
        // We will redirect to account page and we can pass tab name or state.
        // In localstorage we can flag that they enrolled.
        localStorage.setItem("active_account_tab", "courses");
        router.push("/account");
      } else {
        alert("Enrollment failed. Please try again.");
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background text-foreground">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-sans space-y-16">
      
      {/* 1. Header Hero section */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="px-3.5 py-1.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-black rounded-full uppercase tracking-wider">
          Mobile Training Center
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          Master the Art of <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">Mobile Repairing</span>
        </h1>
        <p className="text-sm text-foreground/60 leading-relaxed max-w-2xl mx-auto">
          Gain professional certification and hands-on diagnostic skills. Choose between interactive physical lab training classes or learn online at your own pace with hd pre-recorded videos.
        </p>
      </section>

      {/* 2. Training Center Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-3 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-foreground">Certified Instructors</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            Learn chip-level soldering and logic board schematics directly from technicians with over 10+ years of experience.
          </p>
        </div>
        <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-3 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-foreground">Comprehensive Syllabus</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            Covers everything from hardware diagnoses, screen separation, IC reballing, custom ROM flashing, to iOS restoration.
          </p>
        </div>
        <div className="p-6 bg-card-bg border border-card-border rounded-3xl space-y-3 hover:shadow-md transition-all">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-foreground">Job Placement Help</h3>
          <p className="text-xs text-foreground/60 leading-relaxed">
            Our graduates receive store placement assistance and starter repair toolkit guides to launch their own shops.
          </p>
        </div>
      </section>

      {/* 2.5 Training Center Tour & Expert Instructors */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Physical Lab Tour */}
        <div className="lg:col-span-7 bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Physical Lab Tour
            </span>
            <h2 className="text-xl font-black text-foreground">Explore Our Hardware Repair Lab</h2>
            <p className="text-xs text-foreground/60 leading-relaxed font-medium">
              Watch this clip of our physical training room at New Road, Kathmandu. Get trained with professional microscope stations, temperature-controlled heat guns, logic board schematics trackers, and oscilloscope diagnosis rigs.
            </p>
          </div>

          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-card-border relative shadow-lg my-2">
            <video src="https://www.w3schools.com/html/mov_bbb.mp4" controls className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2 bg-emerald-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase shadow">
              Live Classroom
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-foreground/75">
            <div className="p-2.5 bg-background border border-card-border rounded-xl">🔬 Micro Soldering</div>
            <div className="p-2.5 bg-background border border-card-border rounded-xl">🔌 IC Reballing</div>
            <div className="p-2.5 bg-background border border-card-border rounded-xl">📱 Glass Separation</div>
          </div>
        </div>

        {/* Master Instructors */}
        <div className="lg:col-span-5 bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <span className="px-2.5 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
              Meet the Masters
            </span>
            <h2 className="text-xl font-black text-foreground">Experienced Teachers</h2>
          </div>

          <div className="space-y-6">
            {/* Instructor 1 */}
            <div className="flex gap-4 items-start border-b border-card-border pb-6">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-card-border bg-slate-800 relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop" 
                  alt="Binod Adhikari" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-foreground">Binod Adhikari</h4>
                <p className="text-[10px] font-bold text-primary uppercase">Head Hardware Repair Expert (12+ Yrs Exp)</p>
                <p className="text-xs text-foreground/60 leading-normal font-medium">
                  Former Chief Engineer at Samsung Authorized Service Center. Expert in micro-soldering, motherboard diagnostic circuits, and dual-decker CPU repair.
                </p>
              </div>
            </div>

            {/* Instructor 2 */}
            <div className="flex gap-4 items-start">
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-card-border bg-slate-800 relative">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop" 
                  alt="Sanjay Shrestha" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-foreground">Sanjay Shrestha</h4>
                <p className="text-[10px] font-bold text-primary uppercase">OS & Bootloader Specialist (8+ Yrs Exp)</p>
                <p className="text-xs text-foreground/60 leading-normal font-medium">
                  Leading expert in software diagnostics, bootloader unlocking, FRP locks removal, custom firmware flashing, and Apple iOS restoration protocols.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Course Display Cards */}
      <section className="space-y-8">
        <h2 className="text-2xl font-black text-foreground border-b border-card-border pb-3">Available Programs</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => (
            <div 
              key={course.id} 
              className={`bg-card-bg border border-card-border rounded-3xl overflow-hidden hover:shadow-xl transition-all flex flex-col justify-between group ${
                course.type === "physical" ? "hover:border-emerald-500/20" : "hover:border-teal-500/20"
              }`}
            >
              {course.image && (
                <div className="h-52 w-full overflow-hidden border-b border-card-border/60 relative bg-slate-900/10">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover group-hover:scale-102 transition-all duration-550" 
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-2.5 py-1 text-[9px] font-black rounded-full uppercase tracking-wider shadow ${
                      course.type === "physical" 
                        ? "bg-emerald-500 text-white" 
                        : "bg-teal-500 text-white"
                    }`}>
                      {course.type === "physical" ? "Classroom Lab" : "Online Video + PDFs"}
                    </span>
                  </div>
                </div>
              )}
              <div className="p-8 space-y-6">
                {/* Course Header Info */}
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      course.type === "physical" 
                        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400" 
                        : "bg-teal-100 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400"
                    }`}>
                      {course.type === "physical" ? "🏫 Classroom / Lab Training" : "💻 Online Videos & Study Material"}
                    </span>
                    <h3 className="text-lg font-black text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-foreground/50 font-bold uppercase tracking-wider">Fee</div>
                    <div className="text-xl font-black text-foreground">Rs. {course.price.toLocaleString()}</div>
                  </div>
                </div>

                <p className="text-xs text-foreground/60 leading-relaxed">{course.description}</p>

                {/* Course Meta Grid */}
                <div className="grid grid-cols-2 gap-4 border-t border-card-border/80 pt-4 text-xs font-semibold text-foreground/80">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-foreground/40" />
                    <div>
                      <span className="text-[10px] text-foreground/45 block uppercase">Duration</span>
                      {course.duration}
                    </div>
                  </div>
                  
                  {course.type === "physical" ? (
                    <>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-foreground/40" />
                        <div>
                          <span className="text-[10px] text-foreground/45 block uppercase">Lab Location</span>
                          New Road, Ktm
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <div className="text-[11px] text-foreground/75">
                          <span className="font-extrabold text-[10px] text-emerald-600 dark:text-emerald-400 block uppercase">Schedule Class</span>
                          {course.schedule}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-foreground/40" />
                        <div>
                          <span className="text-[10px] text-foreground/45 block uppercase">Lectures</span>
                          Pre-recorded + Updates
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center gap-2 bg-teal-500/5 p-3 rounded-xl border border-teal-500/10">
                        <BookOpen className="w-4 h-4 text-teal-500" />
                        <div className="text-[11px] text-foreground/75">
                          <span className="font-extrabold text-[10px] text-teal-600 dark:text-teal-400 block uppercase">Syllabus PDF notes</span>
                          {Array.isArray(course.notes) && course.notes.length > 0 ? (
                            `${course.notes.length} downloadable study guide${course.notes.length > 1 ? 's' : ''} included`
                          ) : (
                            "Complete study manuals included with enrollment"
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Sample Video Preview for Online Course */}
                {course.type === "online" && (
                  <div className="space-y-2.5 border-t border-card-border/80 pt-4">
                    <span className="font-extrabold text-[10px] text-teal-600 dark:text-teal-400 uppercase tracking-wider block">
                      Free Course Preview (1 Minute)
                    </span>
                    <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-card-border relative shadow">
                      <video src="https://www.w3schools.com/html/movie.mp4" controls className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 bg-teal-500 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase shadow">
                        Sample Lesson
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Purchase Enrollment trigger */}
              <div className="p-6 bg-card-bg dark:bg-black/15 border-t border-card-border/60 flex items-center justify-between">
                <span className="text-[10px] text-foreground/45 font-bold uppercase">Safe Checkout Verified</span>
                <button
                  onClick={() => handleEnrollClick(course)}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs uppercase text-white shadow-md transition-all active:scale-95 flex items-center gap-1 cursor-pointer ${
                    course.type === "physical"
                      ? "bg-emerald-600 hover:bg-emerald-500"
                      : "bg-teal-600 hover:bg-teal-500"
                  }`}
                >
                  Enroll Now <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Checkout Modal overlay */}
      {isModalOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-card-bg border border-card-border rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full border border-card-border hover:bg-black/5 flex items-center justify-center text-foreground/50 hover:text-foreground cursor-pointer text-xs"
            >
              ✕
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-foreground">Secure Training Center Checkout</h3>
              <p className="text-xs text-foreground/60">Complete payment to enroll in your repairing program.</p>
            </div>

            <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex justify-between items-center text-xs">
              <div>
                <span className="font-extrabold text-[10px] text-primary block uppercase">Selected Course</span>
                <span className="font-bold text-foreground">{selectedCourse.title}</span>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-[10px] text-primary block uppercase">Fee</span>
                <span className="font-black text-sm text-primary">Rs. {selectedCourse.price.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs font-semibold text-foreground/75">
              <div className="space-y-1.5">
                <label>Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Keshav Dangi"
                  className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label>Contact Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="98XXXXXXXX"
                    className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-foreground/60 uppercase tracking-wide">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-card-border text-foreground/75 hover:bg-black/5 hover:bg-white/5"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" /> Credit Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("wallet")}
                    className={`py-2 px-3 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === "wallet"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-card-border text-foreground/75 hover:bg-black/5 hover:bg-white/5"
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" /> Mobile Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-2 px-3 border rounded-xl font-bold text-xs flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === "cash"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-card-border text-foreground/75 hover:bg-black/5 hover:bg-white/5"
                    }`}
                  >
                    <MapPin className="w-4 h-4" /> Pay at Center
                  </button>
                </div>
              </div>

              {/* Credit Card Input Simulation */}
              {paymentMethod === "card" && (
                <div className="p-4 bg-black/5 border border-card-border rounded-2xl space-y-3">
                  <div className="space-y-1">
                    <label>Credit Card Number</label>
                    <input
                      type="text"
                      maxLength={19}
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label>CVV / Code</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full text-xs px-3.5 py-2.5 bg-background border border-card-border text-foreground rounded-xl outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "wallet" && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-center py-6 text-emerald-600 dark:text-emerald-400 font-bold">
                  🔒 eSewa & Khalti Mock Wallet Integration Enabled. Proceeding will trigger immediate simulated confirmation.
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl text-center py-6 text-amber-600 dark:text-amber-400 font-bold">
                  📍 Pay cash or card in person at our training desk on center registration day.
                </div>
              )}

              <button
                type="submit"
                disabled={submittingEnrollment}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-105 text-white font-extrabold rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {submittingEnrollment ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    Complete Enrollment - Rs. {selectedCourse.price.toLocaleString()}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
