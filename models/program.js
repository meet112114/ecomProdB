const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({ 
  exerciseId: {
    type: String,
    required: true
  },
  sets: {
    type: Number
  },
  reps: {
    type: Number
  }
});

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  exercises: [ExerciseSchema]
});

const DaySchema = new mongoose.Schema({
  categories: [CategorySchema]
});

const ProgramSchema = new mongoose.Schema({
  programName: {
    type: String,
    required: true
  },
  
  workoutSchedule: {
    mon: {
      type: DaySchema,
      default: () => ({})
    },
    tue: {
      type: DaySchema,
      default: () => ({})
    },
    wed: {
      type: DaySchema,
      default: () => ({})
    },
    thu: {
      type: DaySchema,
      default: () => ({})
    },
    fri: {
      type: DaySchema,
      default: () => ({})
    },
    sat: {
      type: DaySchema,
      default: () => ({})
    },
    sun: {
      type: DaySchema,
      default: () => ({})
    }
  }
});

const Program = mongoose.model('Program', ProgramSchema);

module.exports = Program