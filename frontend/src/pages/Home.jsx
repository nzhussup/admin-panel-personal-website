import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import PageWrapper from "../utils/SmoothPage";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateProjects = () => {
    console.log("Navigating to projects");
    navigate("/projects");
  };

  const handleNavigateCV = () => {
    console.log("Navigating to CV");
    navigate("/cv");
  };

  const handleNavigateUsers = () => {
    console.log("Navigating to users");
    navigate("/users");
  };

  const handleNavigateAlbums = () => {
    console.log("Navigating to photos");
    navigate("/albums");
  };

  const handleNavigateCVGenerator = () => {
    console.log("Navigating to CV Generator");
    navigate("/cv-generator");
  };

  const handleNavigateLLMConfig = () => {
    console.log("Navigating to LLM Config");
    navigate("/llm");
  };

  return (
    <>
      <Header text={"Welcome to the Admin Panel"} />
      <PageWrapper>
        <div className='container my-5'>
          <div className='row row-cols-1 row-cols-md-2 g-4'>
            {/* Projects Card */}
            <div className='col'>
              <Card
                title='Projects'
                desc='Here you can manage you projects, add new projects, update and delete them.'
                buttontxt='Manage Projects'
                handleFunc={handleNavigateProjects}
              />
            </div>

            {/* CV Card */}
            <div className='col'>
              <Card
                title='CV'
                desc='Here you can manage your CV, add new experiences, update and delete them.'
                buttontxt='Manage CV'
                handleFunc={handleNavigateCV}
              />
            </div>
          </div>
          <div className='row row-cols-1 row-cols-md-2 mt-1 g-4'>
            <div className='col'>
              <Card
                title='Users'
                desc='Here you can manage the users, add new users, update and delete them.'
                buttontxt='Manage Users'
                handleFunc={handleNavigateUsers}
              />
            </div>

            <div className='col'>
              <Card
                title='Albums'
                desc='Here you can manage your albums, add new albums and images, update and delete them.'
                buttontxt='Manage Albums'
                handleFunc={handleNavigateAlbums}
              />
            </div>

            <div className='col'>
              <Card
                title='CV Generator'
                desc='Here you can generate your CV using the CV Generator'
                buttontxt='Generate CV'
                handleFunc={handleNavigateCVGenerator}
              />
            </div>

            <div className='col'>
              <Card
                title='LLM Config'
                desc='Here you can tune LLM specific configurations'
                buttontxt='Configure LLM'
                handleFunc={handleNavigateLLMConfig}
              />
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Home;
