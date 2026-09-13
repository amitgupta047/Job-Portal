import {
  useEffect,
  useState
} from "react";

import api from "../services/api";

const SavedJobs = () => {

  const [jobs, setJobs] =
    useState([]);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs =
    async () => {

      const res =
        await api.get(
          "/saved-jobs"
        );

      setJobs(
        res.data.savedJobs
      );
    };

  return (
    <div>

      <h1>
        My Saved Jobs
      </h1>

      {jobs.map((item) => (

        <div key={item._id}>

          <h3>
            {item.job.title}
          </h3>

          <p>
            {item.job.company}
          </p>

          <p>
            {item.job.location}
          </p>

        </div>

      ))}

    </div>
  );
};

export default SavedJobs;