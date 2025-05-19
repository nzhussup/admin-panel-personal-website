const config = {
  apiBase: "https://api.nzhussup.com",
  apiUrl: "https://api.nzhussup.com/v1",
  authUrl: "https://api.nzhussup.com/auth",
  showLoadingDelay: 500,
  showNoInfoDelay: 500,
  endpoints: {
    wedding: "/wedding",
    base: {
      work_experience: "base/work-experience",
      education: "base/education",
      skills: "base/skill",
      projects: "base/project",
      certificates: "base/certificate",
    },
  },
  cvGeneratorLocalStorageKey: "cvGeneratorSelectedItems",
};

export default config;
