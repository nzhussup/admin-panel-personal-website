import React from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import BackArrow from "../components/BackArrow";
import PageWrapper from "../utils/SmoothPage";

const CV = () => {
  const navigate = useNavigate();
  return (
    <>
      <Header text={"CV Management"} />
      <div className='container my-5'>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='me-auto'>
            <BackArrow />
          </div>
        </div>
        <div className='mt-4'>
          {" "}
          <PageWrapper>
            <div className='row row-cols-1 row-cols-md-2 g-4'>
              {/* Work Experience */}
              <div className='col'>
                <Card
                  title='Work Experience'
                  desc='Here you can manage your work experience, add new experiences, update and delete them.'
                  buttontxt='Manage Work Experience'
                  handleFunc={() => navigate("/cv/work-experience")}
                />
              </div>

              {/* Education */}
              <div className='col'>
                <Card
                  title='Education'
                  desc='Here you can manage your education information, add new degrees, update and delete them.'
                  buttontxt='Manage Education'
                  handleFunc={() => navigate("/cv/education")}
                />
              </div>

              {/* Skills */}
              <div className='col'>
                <Card
                  title='Skills'
                  desc='Here you can manage your skills, add new skills, update and delete them.'
                  buttontxt='Manage Skills'
                  handleFunc={() => navigate("/cv/skills")}
                />
              </div>

              {/* Certifications */}
              <div className='col'>
                <Card
                  title='Certifications'
                  desc='Here you can manage your certifications, add new certifications, update and delete them.'
                  buttontxt='Manage Certifications'
                  handleFunc={() => navigate("/cv/certifications")}
                />
              </div>
            </div>
          </PageWrapper>
        </div>
      </div>
    </>
  );
};

export default CV;
