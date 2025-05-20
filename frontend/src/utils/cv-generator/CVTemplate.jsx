import React from "react";

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "10px" }}>
    <div
      style={{
        fontSize: "15px",
        fontWeight: "bold",
        borderBottom: "1px solid #ccc",
        paddingBottom: "4px",
        margin: "4px 0",
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const Item = ({ title, subtitle, date, description, techStack }) => (
  <div
    style={{
      marginBottom: "6px",
      textAlign: "justify",
      pageBreakInside: "avoid",
      breakInside: "avoid",
    }}
  >
    <strong>{title}</strong> | {subtitle} | <em>{date}</em>
    <div>{description}</div>
    {techStack && (
      <div>
        <strong>Tech Stack:</strong> {techStack}
      </div>
    )}
  </div>
);

const CVTemplate = ({ data }) => {
  const {
    basic_info,
    work_experience,
    education,
    skills,
    projects,
    certificates,
  } = data;

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        padding: "10px 20px",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        {basic_info.name && <h2 style={{ margin: 0 }}>{basic_info.name}</h2>}

        {(basic_info.address ||
          basic_info.phone ||
          basic_info.email ||
          basic_info.website) && (
          <div>
            {basic_info.address}
            {basic_info.address && basic_info.phone && " | "}
            {basic_info.phone}
            {(basic_info.address || basic_info.phone) &&
              basic_info.email &&
              " | "}
            {basic_info.email && (
              <a href={`mailto:${basic_info.email}`}>{basic_info.email}</a>
            )}
            {(basic_info.email || basic_info.phone || basic_info.address) &&
              basic_info.website &&
              " | "}
            {basic_info.website && (
              <a
                href={basic_info.website}
                target='_blank'
                rel='noopener noreferrer'
              >
                {basic_info.website}
              </a>
            )}
          </div>
        )}

        {(basic_info.linkedin || basic_info.github) && (
          <div>
            {basic_info.linkedin && (
              <>
                <a href={basic_info.linkedin}>
                  LinkedIn: {basic_info.linkedin}
                </a>
                {basic_info.github && " | "}
              </>
            )}
            {basic_info.github && (
              <a href={basic_info.github}>GitHub: {basic_info.github}</a>
            )}
          </div>
        )}

        {basic_info.about && (
          <p style={{ textAlign: "justify", marginTop: "4px" }}>
            {basic_info.about}
          </p>
        )}
      </div>

      {work_experience && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <Section title='Work Experience'>
            {work_experience
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((exp) => (
                <Item
                  key={exp.id}
                  title={exp.position}
                  subtitle={`${exp.company}, ${exp.location}`}
                  date={`${exp.startDate} - ${exp.endDate || "Present"}`}
                  description={exp.description}
                  techStack={exp.techStack}
                />
              ))}
          </Section>
        </>
      )}

      {education && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <Section title='Education'>
            {education
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((edu) => {
                const date = `${edu.startDate.slice(0, 10)} - ${
                  edu.endDate ? edu.endDate.slice(0, 10) : "Present"
                }`;

                const descriptionParts = [];
                if (edu.description) {
                  descriptionParts.push(edu.description);
                }
                if (edu.thesis) {
                  descriptionParts.push(`Thesis: ${edu.thesis}`);
                }

                return (
                  <Item
                    key={edu.id}
                    title={edu.degree}
                    subtitle={`${edu.institution}, ${edu.location}`}
                    date={date}
                    description={descriptionParts.join(". ")}
                  />
                );
              })}
          </Section>
        </>
      )}

      {skills && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <Section title='Skills'>
            {skills
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((skill) => (
                <div key={skill.id}>
                  <strong>{skill.category}:</strong> {skill.skillNames}
                </div>
              ))}
          </Section>
        </>
      )}

      {projects && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <Section title='Projects'>
            {projects
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((project) => (
                <div
                  key={project.id}
                  style={{
                    marginBottom: "4px",
                    textAlign: "justify",
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  <strong>{project.name}</strong> (
                  <a href={project.url}>{project.url}</a>)<br />
                  <strong>Tech Stack:</strong> {project.techStack}
                </div>
              ))}
          </Section>
        </>
      )}

      {certificates && (
        <>
          <hr style={{ margin: "6px 0" }} />
          <Section title='Certificates'>
            {certificates
              .sort((a, b) => b.displayOrder - a.displayOrder)
              .map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    marginBottom: "4px",
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  <a href={cert.url}>{cert.name}</a>
                </div>
              ))}
          </Section>
        </>
      )}
    </div>
  );
};

export default CVTemplate;
