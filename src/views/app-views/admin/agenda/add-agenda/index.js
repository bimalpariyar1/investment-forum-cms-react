import React from "react";
import AgendaForm from "../../agenda-form";
import SinglePage from "layouts/SinglePage";
const AddAgenda = () => {
  return (
    <>
      <SinglePage pageTitle="Add Agenda" backLink="/agenda">
        <AgendaForm mode="ADD" />
      </SinglePage>
    </>
  );
};

export default AddAgenda;
