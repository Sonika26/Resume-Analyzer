import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
interface User {
  fullName: string;
  email?: string;
}

function Home() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    api
      .get("/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      <Navbar />

      <main className="relative overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-8">

        {/* ================================================== */}
        {/* BACKGROUND DECORATION */}
        {/* ================================================== */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          {/* Top glow */}
          <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-slate-200/60 blur-3xl" />

          {/* Left glow */}
          <div className="absolute left-[-120px] top-40 h-72 w-72 rounded-full bg-blue-100/40 blur-3xl" />

          {/* Right glow */}
          <div className="absolute right-[-120px] top-60 h-72 w-72 rounded-full bg-slate-200/50 blur-3xl" />

        </div>


        {/* ================================================== */}
        {/* HERO */}
        {/* ================================================== */}

        <section className="relative mx-auto max-w-5xl text-center">

          {/* Badge */}
          <div
            className="
              mx-auto
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              px-4
              py-1.5
              text-[11px]
              font-semibold
              text-slate-600
              shadow-sm
            "
          >
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />

            AI-powered resume analysis
          </div>


          {/* Heading */}
          <h1
            className="
              mx-auto
              mt-6
              max-w-4xl
              text-4xl
              font-bold
              tracking-[-0.045em]
              text-slate-900
              sm:text-5xl
              lg:text-6xl
              lg:leading-[1.05]
            "
          >
            Build a resume that
            <span className="block text-slate-500">
              gets noticed.
            </span>
          </h1>


          {/* Description */}
          <p
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-slate-500
              sm:text-base
            "
          >
            Analyze your resume for ATS compatibility, grammar,
            formatting, and overall quality — all in one place.
          </p>


          {/* ================================================== */}
          {/* USER WELCOME */}
          {/* ================================================== */}

          <div className="mt-7">

            {user ? (
              <div
                className="
                  mx-auto
                  inline-flex
                  items-center
                  gap-3
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  shadow-sm
                "
              >
                {/* Avatar */}
                <div
                  className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-slate-900
                    text-sm
                    font-bold
                    text-white
                  "
                >
                  {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <div className="text-left">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    Welcome back
                  </p>

                  <p className="text-sm font-bold text-slate-800">
                    {user.fullName}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-400">
                Sign in to get started with your resume analysis.
              </p>
            )}

          </div>

        </section>


        {/* ================================================== */}
        {/* FEATURE CARDS */}
        {/* ================================================== */}

        <section className="relative mx-auto mt-14 max-w-5xl">

          <div className="grid gap-4 sm:grid-cols-3">

            {/* ATS */}
            <FeatureCard
              number="01"
              title="ATS Analysis"
              description="See how well your resume performs against applicant tracking systems."
            />

            {/* Grammar */}
            <FeatureCard
              number="02"
              title="Grammar & Writing"
              description="Find grammar, spelling, and writing issues that could weaken your resume."
            />

            {/* Formatting */}
            <FeatureCard
              number="03"
              title="Formatting"
              description="Check structure, organization, and formatting for a cleaner resume."
            />

          </div>

        </section>


        {/* ================================================== */}
        {/* MAIN CTA */}
        {/* ================================================== */}

        <section className="relative mx-auto mt-6 max-w-5xl">

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-[0_10px_40px_rgba(15,23,42,0.06)]
            "
          >

            <div className="grid lg:grid-cols-[1.2fr_0.8fr]">

              {/* CTA content */}
              <div className="p-7 sm:p-9">

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Resume Intelligence
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                  Know exactly what to improve.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-500">
                  Get a clear breakdown of your resume performance and
                  actionable suggestions to help make it stronger.
                </p>

                <a
                  href="/analyze"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-slate-900
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    shadow-[0_6px_18px_rgba(15,23,42,0.16)]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-slate-800
                    hover:shadow-[0_10px_25px_rgba(15,23,42,0.22)]
                  "
                >
                  Analyze My Resume
                </a>

              </div>


              {/* Score preview */}
              <div
                className="
                  flex
                  items-center
                  justify-center
                  border-t
                  border-slate-200
                  bg-slate-50/70
                  p-7
                  lg:border-l
                  lg:border-t-0
                "
              >

                <div className="w-full max-w-xs">

                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        Resume Score
                      </p>

                      <p className="mt-0.5 text-[10px] text-slate-400">
                        Example analysis
                      </p>
                    </div>

                    <span className="text-2xl font-bold text-slate-900">
                      84
                    </span>
                  </div>


                  <div className="space-y-3">

                    <HomeScoreBar
                      title="ATS"
                      score={88}
                    />

                    <HomeScoreBar
                      title="Grammar"
                      score={82}
                    />

                    <HomeScoreBar
                      title="Formatting"
                      score={81}
                    />

                  </div>

                </div>

              </div>

            </div>

          </div>

        </section>


        {/* ================================================== */}
        {/* BOTTOM TEXT */}
        {/* ================================================== */}

        <section className="relative mx-auto mt-10 max-w-2xl text-center">

          <p className="text-xs leading-5 text-slate-400">
            Built to help job seekers understand and improve their resumes
            before applying.
          </p>

        </section>

      </main>
    </div>
  );
}


/* ================================================== */
/* FEATURE CARD */
/* ================================================== */

function FeatureCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-5
        shadow-[0_5px_25px_rgba(15,23,42,0.04)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-slate-300
        hover:shadow-[0_12px_35px_rgba(15,23,42,0.08)]
      "
    >

      <div className="flex items-center justify-between">

        <span
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-lg
            bg-slate-100
            text-[10px]
            font-bold
            text-slate-500
          "
        >
          {number}
        </span>

      </div>


      <h3 className="mt-5 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  );
}


/* ================================================== */
/* SCORE BAR */
/* ================================================== */

function HomeScoreBar({
  title,
  score,
}: {
  title: string;
  score: number;
}) {
  return (
    <div>

      <div className="mb-1.5 flex items-center justify-between">

        <span className="text-[10px] font-semibold text-slate-500">
          {title}
        </span>

        <span className="text-[10px] font-bold text-slate-700">
          {score}
        </span>

      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">

        <div
          className="
            h-full
            rounded-full
            bg-slate-900
            transition-all
            duration-700
          "
          style={{
            width: `${score}%`,
          }}
        />

      </div>

    </div>
  );
}


export default Home;