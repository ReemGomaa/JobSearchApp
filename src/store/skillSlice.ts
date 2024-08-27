import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Skill {
  id: string;
  attributes: { name: string; type: string; importance: string; level: string };
  relationships: { jobs: { id: string }[]; skills: { id: string }[] };
}

interface SkillsState {
  skill: Skill | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: SkillsState = {
  skill: null,
  status: 'idle',
  error: null,
};

export const fetchSkill = createAsyncThunk(
  'skills/fetchSkill',
  async (id: string) => {
    const response = await fetch(`https://skills-api-zeta.vercel.app/skill/${id}`);
    const data = await response.json();
    return data;
  }
);

export const skillSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkill.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSkill.fulfilled, (state, action) => {
        state.status = 'idle';
        state.skill = action.payload.data.skill;
      })
      .addCase(fetchSkill.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch skill';
      });
  },
});

export default skillSlice.reducer;
