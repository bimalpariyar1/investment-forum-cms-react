import React from "react";
import AgendaForm from "../../agenda-form";
import SinglePage from "layouts/SinglePage";
const EditAgenda = (props) => {
  return (
    <>
      <SinglePage pageTitle="Edit Agenda" backLink="/agenda">
        <AgendaForm mode="EDIT" params={props.match.params.id} />
      </SinglePage>
    </>
  );
};

export default EditAgenda;
