import Header from "@ui/Header";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Inter, Vazirmatn } from "next/font/google";
import { useRouter } from "next/router";

const VazirmatnFont = Vazirmatn({
  subsets: ["latin", "arabic"],
  weight: ["400", "700"],
});
const InterFont = Inter({ subsets: ["latin"] });

type Project = {
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
};

export const getStaticProps = async ({ locale }: { locale: string }) => {
  const currentLocale = locale || "en";
  return {
    props: {
      ...(await serverSideTranslations(currentLocale, ["common", "projects"])),
    },
  };
};

const ProjectsPage = () => {
  const { locale } = useRouter();
  const { t, i18n } = useTranslation("projects");

  const isFa = i18n.language === "fa";
  const fontClass = isFa ? VazirmatnFont.className : InterFont.className;
  const pageDir = isFa ? "rtl" : "ltr";

  const projects = t("projects", { returnObjects: true }) as Project[];

  return (
    <div
      className={`min-h-screen bg-stone-900 text-amber-300 px-3 sm:px-5 py-5 ${fontClass}`}
      dir={pageDir}
    >
      <Header currentLang={locale} />

      <main className="max-w-4xl mx-auto mt-10">
        <h1 className="text-4xl font-bold mb-3 text-center text-amber-400">
          {t("title", "Personal Projects")}
        </h1>
        <p className="text-center text-amber-300/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          {t("intro")}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.isArray(projects) &&
            projects.map((project, index) => (
              <div
                key={index.toString()}
                className="bg-stone-800 rounded-2xl p-6 shadow-lg flex flex-col"
              >
                <h2 className="text-xl font-semibold text-amber-400 mb-2">
                  {project.title}
                </h2>
                <p className="text-amber-300/90 leading-relaxed mb-4 flex-grow">
                  {project.description}
                </p>

                {Array.isArray(project.tech) && project.tech.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="bg-amber-500 text-stone-900 text-xs font-medium px-2 py-1 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {(project.github || project.demo) && (
                  <div className="flex gap-3 mt-auto">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-stone-700 text-amber-300 font-semibold hover:bg-amber-500 hover:text-black transition"
                      >
                        GitHub
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-stone-700 text-amber-300 font-semibold hover:bg-amber-500 hover:text-black transition"
                      >
                        Demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;
