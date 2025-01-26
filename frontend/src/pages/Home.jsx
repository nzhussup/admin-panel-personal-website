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

  const handleNavigateUsers = () => {
    console.log("Navigating to users");
    navigate("/users");
  };

  const handleNavigatePhotos = () => {
    console.log("Navigating to photos");
    navigate("/photos");
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
                title='Photos'
                desc='Here you can manage your photos, add new photos, update and delete them.'
                buttontxt='Manage Photos'
                handleFunc={handleNavigatePhotos}
              />
            </div>
          </div>
        </div>
      </PageWrapper>
    </>
  );
};

export default Home;
