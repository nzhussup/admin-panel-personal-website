import React from "react";
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
        </div>
      </PageWrapper>
    </>
  );
};

export default Home;
