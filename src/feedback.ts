export function getFeedback(array3D: string[][][], classLevel: number, score: number, parameter: string) {
    /**
     * Retrieve feedback from a 3D array based on class level, score, and parameter.
     * 
     * @param {Array} array3D - 3D array containing feedback messages.
     * @param {string|number} classLevel - Class level (e.g., "nursery", "LKG", 1, 2, etc.).
     * @param {number} score - Numerical score.
     * @param {string} parameter - Parameter name (e.g., "pronunciation", "fluency").
     * @return {string} - Feedback message.
     */
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
    if (array3D[stageIndex] && array3D[stageIndex][rangeIndex] && array3D[stageIndex][rangeIndex][parameterIndex] !== undefined) {
        return array3D[stageIndex][rangeIndex][parameterIndex];
    } else {
        return "Invalid indices provided.";
    }
}

// Example 3D array
export const array3D = [
    [ // Stage: FLN
        [ // Range: 0-20
            "Student_Name needs lots of practice in Vocabulary", 
            "Needs a lot of practice",
            "Improve pronunciation by practicing specific sounds clearly."
        ],
        [ // Range: 21-40
            "Focus on practicing individual sounds with clear modeling and repetition to build accurate pronunciation.",
            "Practice reading aloud regularly with easy texts to build speed and smoothness.",
            "Work on clear enunciation of sounds and practice with feedback."
        ],
        [ // Range: 41-60
            "Concentrate on practicing specific sounds with clear examples and frequent repetition to develop pronunciation.",
            "Work on reading aloud with slightly more challenging texts and focus on improving speed and expression.",
            "Focus on achieving consistent pronunciation with more complex words."
        ],
        // Additional ranges...
    ],
    [ // Stage: Preparatory
        [ // Range: 0-20
            "Student_Name bla bla bla",
            "",
            ""
        ],
        [ // Range: 21-40
            "Provide targeted support and encouragement to develop basic skills.",
            "Encourage practice with simple texts and focus on building foundational skills.",
            "Develop basic pronunciation skills with clear, repetitive practice."
        ],
        // Additional ranges...
    ],
    // Additional stages...
];

// Example call to the function
// const feedback = getFeedback(array3D, 5, 16, "accuracy");
// console.log(feedback);  // Outputs: Improve pronunciation by practicing specific sounds clearly.
