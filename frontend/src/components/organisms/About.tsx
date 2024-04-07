import { Grid } from "@mui/material";
import React, { useState, useRef } from "react";
import Button from "../atoms/Button";
import Modal from "../molecules/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/utils/api";
import Loading from "../molecules/Loading";
import Snackbar from "../atoms/Snackbar";
import Markdown from "react-markdown";

import UploadIcon from "@mui/icons-material/Upload";
import EditIcon from "@mui/icons-material/Edit";
import { useAuth } from "@/utils/AuthContext";
import dynamic from "next/dynamic";

const EditorComp = dynamic(() => import("@/components/atoms/Editor"), {
  ssr: false,
});

interface AboutProps {
  edit: boolean;
}

type modalBodyProps = {
  handleModal: () => void;
  handleConfirmClose: () => void;
};

const ModalBody = ({ handleModal, handleConfirmClose }: modalBodyProps) => {
  return (
    <div>
      <p className="text-center text-2xl font-bold">Publish text changes?</p>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Button
            className="border-solid border-2 border-black font-semibold"
            variety="secondary"
            onClick={handleConfirmClose}
          >
            Cancel
          </Button>
        </Grid>
        <Grid item md={6} xs={12}>
          <Button className="font-semibold" onClick={handleModal}>
            Yes, publish
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

type aboutPageData = {
  pageid: string;
  content: string;
};

/**
 * An About component
 */
const About = ({ edit }: AboutProps) => {
  const { role } = useAuth();

  /** State variables for the notification popups */
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  /** Handles form errors for time and date validation */
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /** Tanstack query for fetching the about page data */
  const {
    data: aboutPageDetailsQuery,
    isPending: aboutPageFetchPending,
    isError,
  } = useQuery({
    queryKey: ["about"],
    queryFn: async () => {
      const { data } = await api.get("/about");
      setMarkdown(data["data"]?.content);
      return data["data"];
    },
  });

  let { pageid, content }: aboutPageData = {
    pageid: aboutPageDetailsQuery?.id,
    content: aboutPageDetailsQuery?.content,
  };

  const queryClient = useQueryClient();

  /** Tanstack query mutation for changing the about page content */
  const { mutateAsync: updateAboutPage } = useMutation({
    mutationFn: async (variables: { newContent: string }) => {
      const { newContent } = variables;
      const { data } = await api.patch(`/about/${pageid}`, {
        newContent: newContent,
      });
      return data;
    },
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      setSuccessNotificationOpen(true);
      setSuccessMessage("Successfully Updated Page Content!");
    },
    onError: (e: Error) => {
      console.log(e.message);
      setErrorNotificationOpen(true);
      setErrorMessage("Couldn't Update Page Content");
    },
  });

  const [markdown, setMarkdown] = useState("");
  const handleEditorChange = (editorValue: string) => {
    setMarkdown(editorValue);
    console.log(markdown);
  };

  const [openConfirm, setOpenConfirm] = React.useState(false);
  const [editMode, setEditMode] = React.useState(false);
  const handleConfirmOpen = () => setOpenConfirm(true);
  const handleConfirmClose = () => setOpenConfirm(false);
  const handleEditOpen = () => setEditMode(true);
  const handleEditClose = () => {
    setEditMode(false);
    setMarkdown(content);
  };
  const handleModalClick = async () => {
    setEditMode(false);
    handleConfirmClose();
    await updateAboutPage({ newContent: markdown });
  };

  if (aboutPageFetchPending) {
    return <Loading />;
  }

  if (editMode == true) {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="col-start-1 col-span-1 sm:col-start-1 sm:col-span-1">
            <Button
              className="bg-white"
              variety="secondary"
              disabled
              icon={<UploadIcon />}
            >
              Upload Image
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-2 sm:col-span-1">
            <Button
              className="bg-white"
              variety="secondary"
              onClick={handleEditClose}
              disabled
              icon={<EditIcon />}
            >
              Edit Text
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-5 sm:col-span-1">
            <Button variety="error" onClick={handleEditClose}>
              Cancel
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-6 sm:col-span-1">
            <Button variety="primary" onClick={handleConfirmOpen}>
              Publish changes
            </Button>
          </div>
        </div>
        <h2></h2>
        <div className="space-y-2">
          <Modal
            open={openConfirm}
            handleClose={handleConfirmClose}
            children={
              <ModalBody
                handleModal={handleModalClick}
                handleConfirmClose={handleConfirmClose}
              />
            }
          />
        </div>
        <div className="border border-gray-300 border-solid rounded-lg bg-white">
          <EditorComp onChange={handleEditorChange} markdown={markdown} />
        </div>
      </>
    );
  } else {
    return (
      <div>
        {/* Error component */}
        <Snackbar
          variety="error"
          open={errorNotificationOpen}
          onClose={() => setErrorNotificationOpen(false)}
        >
          Error: {errorMessage}
        </Snackbar>

        {/* Success component */}
        <Snackbar
          variety="success"
          open={successNotificationOpen}
          onClose={() => setSuccessNotificationOpen(false)}
        >
          {successMessage}
        </Snackbar>

        <div className="grid grid-cols-1 sm:grid-cols-6 gap-4">
          <div className="col-start-1 col-span-1 sm:col-start-1 sm:col-span-1">
            <Button
              className="bg-white"
              variety="secondary"
              icon={<UploadIcon />}
            >
              Upload Image
            </Button>
          </div>
          <div className="col-start-1 col-span-1 sm:col-start-2 sm:col-span-1">
            <Button
              className="bg-white"
              variety="secondary"
              onClick={handleEditOpen}
              icon={<EditIcon />}
            >
              Edit Text
            </Button>
          </div>
        </div>

        {role === "Supervisor" ? (
          <div>
            <h2>You're a supervisor</h2>
          </div>
        ) : role === "Admin" ? (
          <div>
            <h2>
              Yay!! you're an admin. You get special privileges on this page.
            </h2>
          </div>
        ) : role === "Volunteer" ? (
          <div>
            <h2>You're a volunteer</h2>
          </div>
        ) : (
          <></>
        )}
        <Markdown>{markdown}</Markdown>
      </div>
    );
  }
};

export default About;
