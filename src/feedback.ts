  export function getFeedback(array_3d : string[][][], classLevel: number, score: number, parameter: string) {

    type ClassToStageType = {
        [key: string]: "FLN" | "Preparatory" | "Middle" | "Senior" | "Sr. Secondary";
      };
      
      // Define the classToStage object with the specified type
      const classToStage: ClassToStageType = {
        "Nursery": "FLN",
        "LKG": "FLN",
        "UKG": "FLN",
        1: "FLN",
        2: "FLN",
        3: "Preparatory",
        4: "Preparatory",
        5: "Preparatory",
        6: "Middle",
        7: "Middle",
        8: "Middle",
        9: "Senior",
        10: "Senior",
        11: "Sr. Secondary",
        12: "Sr. Secondary"
      };

    const stages = {
        "FLN": 0,
        "Preparatory": 1,
        "Middle": 2,
        "Senior": 3,
        "Sr. Secondary": 4
    };

    const ranges = [
        { min: 0, max: 20, index: 0 },
        { min: 21, max: 40, index: 1 },
        { min: 41, max: 60, index: 2 },
        { min: 61, max: 65, index: 3 },
        { min: 66, max: 70, index: 4 },
        { min: 71, max: 80, index: 5 },
        { min: 81, max: 90, index: 6 },
        { min: 91, max: 100, index: 7 }
    ];


    type ParametersType = {
        [key: string]: number;
      };

    const parameters:ParametersType = {
        "accuracy": 0,
        "fluency": 1,
        "prosody": 2
    };

    const stage = classToStage[classLevel];
    const stageIndex = stages[stage];
    const parameterIndex = parameters[parameter];

    // Find the correct range index based on the score
    const rangeIndex = ranges.find(range => score >= range.min && score <= range.max)?.index;

    // Validate indices
    if (stageIndex === undefined || rangeIndex === undefined || parameterIndex === undefined) {
        return "Invalid class level, score, or parameter.";
    }

    // Access the specific feedback based on indices
    if (array_3d[stageIndex] && array_3d[stageIndex][rangeIndex] && array_3d[stageIndex][rangeIndex][parameterIndex] !== undefined) {
        return array_3d[stageIndex][rangeIndex][parameterIndex];
    } else {
        return "Invalid indices provided.";
    }
}

// Example 3D array
export const array_3d = [
    [
      [
        "Needs lots of practice in Vocabulary",
        "Needs a great deal of practice",
        "Concentrated and focussed practice is needed to achieve acceptable levels of intonation and rhythm"
      ],
      [
        "Focus on practicing individual sounds with clear modeling and repetition to build accurate pronunciation.",
        "Practice reading aloud regularly with easy texts to build speed and smoothness.",
        "Regular practice in intonation and rhythm must be adopted"
      ],
      [
        "Concentrate on practicing specific sounds with clear examples and frequent repetition to develop pronunciation.",
        "Work on reading aloud with slightly more challenging texts and focus on improving speed and expression.",
        "More practice and focus on the context is needed for better intonation and rhythm."
      ],
      [
        "Work on practicing distinct sounds with clear demonstrations and regular repetition to achieve correct pronunciation.",
        "Practice with varied texts to refine your pacing and expression while aiming for smoother and more natural reading.",
        "Fairly good.More practice required"
      ],
      [
        "Work on refining sound differences and stress patterns with focused exercises and everyday conversation practice.",
        "Practice with diverse texts, concentrating on expression and rhythm to achieve a more natural reading style.",
        "Practice more on the correct rhythm and intonation"
      ],
      [
        "Work on refining sound differences and stress patterns through specific drills and frequent speaking practice.",
        "Challenge yourself with varied and complex texts while focusing on smoothness and natural expression.",
        "Of a high standard. A little more practice will go a long way"
      ],
      [
        "Keep up the good work by refining intonation and rhythm through continued practice.",
        "You're doing great with your reading fluency; keep it up by trying new texts to make your reading even smoother.",
        "Excellent way of reading.Keep it up"
      ],
      [
        "Keep up the excellent work by further perfecting your intonation and rhythm with ongoing practice.",
        "You're excelling in reading fluency, keep challenging yourself with new and varied texts to maintain and enhance your skills.",
        "Excellent intonation and rhythm. Maintain the high standards"
      ]
    ],
    [
      [
        "Needs a lot of practice",
        "Must work very hard to be able to read and comprehend well",
        "Repetitive practice is required to reach acceptable levels of intonation and rhythm"
      ],
      [
        "A lot of practice required to acquire correct pronunciation",
        "You must acquire good fluency through regular loud reading",
        "Practice more on the correct rhythm and intonation"
      ],
      [
        "You need regular practice of the content words regularly",
        "You must put in some more regular practice for better fluency",
        "Put in regular practice for correct rhythm and intonation"
      ],
      [
        "Good but there is scope for improvement",
        "Fluency is adequate but can be better",
        "Acceptable rhythm and intonation but there is room for improvement"
      ],
      [
        "You are quite good but can refine your pronunciation",
        "You are quite fluent but can do better",
        ""
      ],
      [
        "Very good pronunciation and some more practice will make you perfect",
        "Fluency is quite good and practice will make you better",
        "Put in some more practice for better intonation and rhythm"
      ],
      [
        "Excellent pronunciation standards.Very close to the benchmark",
        "Fluency is very good.A little more practice required",
        "Intonation and rhythm is very good"
      ],
      [
        "Almost perfect pronunciation.Keep it up",
        "Fluency is excellent.",
        "Intonation and rhythm is excellent"
      ]
    ],
    [
      [
        "Needs a lot of practice",
        "A  great amount of time must be given to improve this skill for good reading skills",
        "High level of practice must be put in to reach acceptable levels of intonation  and rhythm"
      ],
      [
        "You have to practice very hard to be understood by others",
        "Speak slowly and carefully to be understood by others",
        "You should avoid single tone and bring in rhythm in your speaking"
      ],
      [
        "You have to put in more efforts to improve your pronunciation",
        "Practice more to improve your fluency",
        "Work harder to improve your stress and intonation patterns"
      ],
      [
        "You are at mid-level and must work some more to improve your pronunciation",
        "Some more effort must be put in to improve your fluency",
        "Focus more on improving your stress and intonation"
      ],
      [
        "Put in more effort to improve your pronunciation",
        "You need to speak better and faster to improve your fluency",
        "Concentrate more on improving your stress and intonation"
      ],
      [
        "Good pronunciation however, consistent practice would contribute for better pronunciation",
        "You are quite fluent. Some more practice will take you closer to the benchmark.",
        "More practice and focus on the context is needed for better intonation and rhythm."
      ],
      [
        "Excellent pronunciation standards.Very close to the benchmark",
        "Excellent fluency. Maintain the standards well.",
        "Excellent stress and intonation.Keep it up!"
      ],
      [
        "Near perfect pronunciation. Keep it up!",
        "Outstanding fluency! Maintain the standard!",
        "You have reached the benchmark level in stress and intonation!"
      ]
    ],
    [
      [
        "Needs a lot of practice",
        "At this level, dedicated time must be given to improve fluency. This practice will help to understand all subjects well.",
        "To be socially and linguistically acceptable, great efforts must be put in to acquire good intonation and rhythm"
      ],
      [
        "You have to work extremely hard to be understood by anyone.",
        "Don’t speak in fragments.Maintain a flow when speaking",
        "Monotone is not acceptable. Learn to cultivate the correct the rhythm and intonation!"
      ],
      [
        "Stay focused and pay attention to improve your pronunciations.",
        "Fluency is just adequate. Put in more effort to improve your fluency",
        "Do not use the same tone for all words.Variations in rhythm and tone are important!"
      ],
      [
        "Good pronunciation but some more practice required",
        "Fluency is good but some more improvement should be shown!",
        "Intonation and rhythm levels are adequate but more practice is needed."
      ],
      [
        "Very good pronunciation and some more practice will make you perfect",
        "Fairly good fluency. Little more efforts will help to improve.",
        "Good attempt. Consistent efforts will help to improve the intonation and stress."
      ],
      [
        "Good pronunciation but a little more consious efforts would help in improving your pronunciation.",
        "Good fluency. More improvement needed",
        "Good efforts in sustaining the stress and intonation. Put in a little more efforts to attain perfection."
      ],
      [
        "Very good pronunciatio! Some more practice will make you perfect.",
        "Fluency is excellent! Maintain the standards!",
        "Excellent stress and intonation levels.Keep it up!"
      ],
      [
        "Excellent pronunciation standards.Very close to the benchmark.",
        "Outstanding fluency! Maintain the standard!",
        "Near perfection.Keep the standards cotinuously high!"
      ]
    ],
    [
      [
        "N/A", "N/A", "N/A"
      ],
      [
        "N/A", "N/A", "N/A"
      ],
      [
        "N/A", "N/A", "N/A"
      ],
      [
        "N/A", "N/A", "N/A"
      ],
      [
        "N/A", "N/A", "N/A"
      ],
      [
        "N/A", "N/A", "N/A"
      ],
      [
        "N/A", "N/A", "N/A"
      ],
      [
        "N/A", "N/A", "N/A"
      ]
    ]
  ];
  



// Example call to the function
// const feedback = getFeedback(array_3d, 8, 95, "fluency");
// console.log(feedback);  // Outputs: Improve pronunciation by practicing specific sounds clearly.
