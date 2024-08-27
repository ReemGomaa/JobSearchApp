// jobsSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface Job {
  id: string;
  attributes: { title: string };
  relationships: { skills: { id: string }[] };
}

interface JobsState {
  jobs: Job[];
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  totalJobs: number;
}

interface FetchJobsResponse {
  jobs: Job[];
  meta: {
    count: number;
  };
}

const initialState: JobsState = {
  jobs: [],
  status: 'idle',
  error: null,
  totalJobs: 0,
};

export const fetchJobs = createAsyncThunk<FetchJobsResponse, { cursor: number; limit: number }>(
  'jobs/fetchJobs',
  async ({ cursor, limit }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://skills-api-zeta.vercel.app/jobs?cursor=${cursor}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      return { jobs: data.data.jobs, meta: data.data.meta };
    } catch (error) {
      return rejectWithValue('Failed to fetch jobs');
    }
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearJobs: (state) => {
      state.jobs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = 'idle';

        // Check if the jobs are already in the state
        const newJobs = action.payload.jobs.filter(job => !state.jobs.some(existingJob => existingJob.id === job.id));

        state.jobs = [...state.jobs, ...newJobs];
        state.totalJobs = action.payload.meta.count;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});


export default jobsSlice.reducer;
