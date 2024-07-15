const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const programSchema = new mongoose.Schema({
      programName: {
        type: String,
        required: true
      },
      workoutSchedule: {
        
        mon : {
          categories: [
            {
              categoryName: {
                type: String,
                required: true
              },
              exercises: [
                {
                  exerciseId: {
                    type: String,
                    required: true
                  },
                  sets: {
                    type: Number
                  },
                  reps: {
                    type:Number
                  }
                }
              ]
            }
          ]
      },
      tue : {
        categories: [
          {
            categoryName: {
              type: String,
              required: true
            },
            exercises: [
              {
                exerciseId: {
                  type: String,
                  required: true
                },
                sets: {
                  type: Number
                },
                reps: {
                  type:Number
                }
              }
            ]
          }
        ]
    },
    wed : {
        categories: [
          {
            categoryName: {
              type: String,
              required: true
            },
            exercises: [
              {
                exerciseId: {
                  type: String,
                  required: true
                },
                sets: {
                  type: Number
                },
                reps: {
                  type:Number
                }
              }
            ]
          }
        ]
    },
    thu : {
        categories: [
          {
            categoryName: {
              type: String,
              required: true
            },
            exercises: [
              {
                exerciseId: {
                  type: String,
                  required: true
                },
                sets: {
                  type: Number
                },
                reps: {
                  type:Number
                }
              }
            ]
          }
        ]
    },
    fri : {
        categories: [
          {
            categoryName: {
              type: String,
              required: true
            },
            exercises: [
              {
                exerciseId: {
                  type: String,
                  required: true
                },
                sets: {
                  type: Number
                },
                reps: {
                  type:Number
                }
              }
            ]
          }
        ]
    },
    sat : {
        categories: [
          {
            categoryName: {
              type: String,
              required: true
            },
            exercises: [
              {
                exerciseId: {
                  type: String,
                  required: true
                },
                sets: {
                  type: Number
                },
                reps: {
                  type:Number
                }
              }
            ]
          }
        ]
    },
    sun : {
        categories: [
          {
            categoryName: {
              type: String,
              required: true
            },
            exercises: [
              {
                exerciseId: {
                  type: String,
                  required: true
                },
                sets: {
                  type: Number
                },
                reps: {
                  type:Number
                }
              }
            ]
          }
        ]
    }
}

});


const Program = mongoose.model('Program', programSchema);

module.exports = Program;