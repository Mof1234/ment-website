import React, { useState } from "react";
import "../css/navbar.css";
import NavBar from "./NavBar";
import ProfileSetup1 from "./ProfileSetup1";
import ProfileSetup2 from "./ProfileSetup2";
import Education from "./Education";
import MenteePreferences from "./MenteePreferences";
import MenteePreferences2 from "./MenteePreferences2";
import MenteePreferences3 from "./MenteePreferences3";
import { useMutation } from "@tanstack/react-query";
import Popup from "reactjs-popup";
import { deleteUser, getCurrentUser } from "aws-amplify/auth";
import { generateClient } from "aws-amplify/api";
import { listMenteePreferences, listMenteeProfiles } from "../graphql/queries";
import * as mutations from '../graphql/mutations';
import { useNavigate } from "react-router-dom";

const client = generateClient();

function Settings() {
  const [activeTab, setActiveTab] = useState("profile");

  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
  const closeConfirm = () => setShowConfirmPopup(false);

  const navigate = useNavigate();

  const getTabComponent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSetup1 settings={true} />
      case "socials":
        return <ProfileSetup2 settings={true}/>
      case "education":
        return <Education settings={true}/>
      case "skills":
        return <MenteePreferences settings={true} />
      case "type":
        return <MenteePreferences2 settings={true} />
      case "goal":
        return <MenteePreferences3 settings={true}/>
      default:
        setActiveTab("profile")
        return <ProfileSetup1 settings={true} />
    }
  };

  const deleteProfile = useMutation({
    mutationFn: async () => {
      try {
        setShowConfirmPopup(false);

        const { username } = await getCurrentUser();
        const variables = {
          filter: {
            owner: {
              contains: username
            }
          }
        };

        const profileResponse = await client.graphql({
          query: listMenteeProfiles,
          variable: variables,
        })

        const menteeProfileId = {
          id: profileResponse?.data?.listMenteeProfiles?.items[0].id
        }
      
        const preferencesResponse = await client.graphql({
          query: listMenteePreferences,
          variable: variables,
        })

        const menteePreferencesId = {
         id: preferencesResponse?.data?.listMenteePreferences?.items[0]?.id
        }

        // console.log(menteeProfileId);
        // console.log(menteePreferencesId);
        
        await client.graphql({
          query: mutations.deleteMenteeProfile,
          variables: { input: menteeProfileId }
        });

        await client.graphql({
          query: mutations.deleteMenteePreferences,
          variables: { input: menteePreferencesId }
        });

        await deleteUser();

        navigate("/", {replace: true});
      } catch (error) {
        console.log("Error deleting user profile ", error);
      }
    }
  })

  return (
    <div>

      {/* Popup to confirm deletion of profile */}
      <Popup open={showConfirmPopup} modal closeOnDocumentClick onClose={closeConfirm}>
        <div className="py-3 px-3">
          <div className="row">
          <h2 className="tw-font-oceanwide tw-text-center mt-1">Are you sure?</h2>
          <p className="tw-font-dmsans tw-text-center ">
            Clicking confirm will delete your profile and log you out of MENT.
          </p> 
          </div>
          <div className="row d-flex justify-content-center">
            <div className="col-3 d-flex justify-content-center">
              <button className="tw-font-bold tw-text-white tw-font-dmsans tw-border-[#5685C9] tw-border-0.5 tw-py-2 tw-px-3 hover:tw-text-[#5685C9] tw-bg-[#5685C9] rounded tw-border-solid hover:tw-bg-white tw-duration-300" onClick={() => {deleteProfile.mutate()}}>Confirm</button>
            </div>
            <div className="col-3 d-flex justify-content-center">
              <button className="tw-font-bold tw-text-white tw-font-dmsans tw-border-[#dc3545] tw-border-0.5 tw-py-2 tw-px-7 hover:tw-text-[#dc3545] tw-bg-[#dc3545] rounded tw-border-solid hover:tw-bg-white tw-duration-300" onClick={closeConfirm}>Exit</button>
            </div>
          </div>
        </div>
      </Popup>

      <NavBar focused={"profile"}/>

      <div className="tw-container tw-mx-auto tw-px-4 tw-py-6">
        <div className="row align-items-center">
          <div className="col">
            <h1 className="tw-font-oceanwide">
              Profile Settings
            </h1>
            <p className="tw-font-dmsans mt-2 tw-text-[#5C667B]">
              Modify your profile settings and mentor preferences.
            </p>
          </div>
        </div>

        <div className="tw-bg-white tw-shadow tw-rounded-lg tw-p-6 tw-mt-4">
          <div className="tw-border-b tw-border-gray-200 tw-mb-4">
            <nav className="tw-flex tw-space-x-1 tw-justify-center">
              <button
                onClick={() => setActiveTab("profile")}
                className={`tw-px-6 tw-py-2 tw-text-sm tw-font-medium tw-rounded-t-lg ${
                  activeTab === "profile"
                    ? "tw-bg-white tw-font-dmsans tw-border tw-border-b-0 tw-border-gray-300"
                    : "tw-bg-[gray-100] tw-font-dmsans tw-border-b-2 tw-border-transparent hover:tw-bg-white"
                }`}
              >
              Profile
              </button>
              <button
                onClick={() => setActiveTab("socials")}
                className={`tw-px-6 tw-py-2 tw-text-sm tw-font-medium tw-rounded-t-lg ${
                  activeTab === "socials"
                    ? "tw-bg-white tw-font-dmsans tw-border tw-border-b-0 tw-border-gray-300"
                    : "tw-bg-gray-100 tw-font-dmsans tw-border-b-2 tw-border-transparent hover:tw-bg-white"
                }`}
              >
              Socials
              </button>
              <button
                onClick={() => setActiveTab("education")}
                className={`tw-px-6 tw-py-2 tw-text-sm tw-font-medium tw-rounded-t-lg ${
                  activeTab === "education"
                    ? "tw-bg-white tw-font-dmsans tw-border tw-border-b-0 tw-border-gray-300"
                    : "tw-bg-gray-100 tw-font-dmsans tw-border-b-2 tw-border-transparent hover:tw-bg-white"
                }`}
              >
                Education
              </button>
              <button
                onClick={() => setActiveTab("skills")}
                className={`tw-px-6 tw-py-2 tw-text-sm tw-font-medium tw-rounded-t-lg ${
                  activeTab === "skills"
                    ? "tw-bg-white tw-font-dmsans tw-border tw-border-b-0 tw-border-gray-300"
                    : "tw-bg-gray-100 tw-font-dmsans tw-border-b-2 tw-border-transparent hover:tw-bg-white"
                }`}
              >
                Skill Preferences
              </button>
              <button
                onClick={() => setActiveTab("type")}
                className={`tw-px-6 tw-py-2 tw-text-sm tw-font-medium tw-rounded-t-lg ${
                  activeTab === "type"
                    ? "tw-bg-white tw-font-dmsans tw-border tw-border-b-0 tw-border-gray-300"
                    : "tw-bg-gray-100 tw-font-dmsans tw-border-b-2 tw-border-transparent hover:tw-bg-white"
                }`}
              >
                Type/Location Preferences
              </button>
              <button
                onClick={() => setActiveTab("goal")}
                className={`tw-px-6 tw-py-2 tw-text-sm tw-font-medium tw-rounded-t-lg ${
                  activeTab === "goal"
                    ? "tw-bg-white tw-font-dmsans tw-border tw-border-b-0 tw-border-gray-300"
                    : "tw-bg-gray-100 tw-font-dmsans tw-border-b-2 tw-border-transparent hover:tw-bg-white"
                }`}
              >
                Goal Preferences
              </button>
            </nav>
          </div>
          <div className="tw-p-4">{getTabComponent()}</div>
        </div>

        <div className="row mt-5">
            <h3 className="tw-font-oceanwide">Done with your journey?</h3>
        </div>
        <div className="row">
          <div className="col-2">
            <button
             onClick={() => {setShowConfirmPopup(true)}}
             className="tw-font-bold tw-text-white tw-font-dmsans tw-border-[#dc3545] tw-border-0.5 tw-py-2 tw-px-7 hover:tw-text-[#dc3545] tw-bg-[#dc3545] rounded tw-border-solid hover:tw-bg-white tw-duration-300">Delete Profile</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default Settings;
