exports.standardizeMood = (extractedMood) => {
  try {
    // If no mood is extracted, return "calm"
    if (!extractedMood) return "calm";

    // Predefined mood categories
    const predefinedMoods = ["happy", "angry", "sad", "love", "calm"];

    // Mapping of descriptive moods to predefined categories
    const moodMapping = {
      // Happy
      happy: "happy",
      joyful: "happy",
      excited: "happy",
      cheerful: "happy",
      delighted: "happy",

      // Angry
      angry: "angry",
      furious: "angry",
      irritated: "angry",
      annoyed: "angry",
      frustrated: "angry",

      // Sad
      sad: "sad",
      depressed: "sad",
      unhappy: "sad",
      miserable: "sad",
      down: "sad",

      // Love
      love: "love",
      affectionate: "love",
      romantic: "love",
      passionate: "love",
      caring: "love",

      // Calm
      calm: "calm",
      peaceful: "calm",
      relaxed: "calm",
      serene: "calm",
      tranquil: "calm",
    };

    // Convert the extracted mood to lowercase for case-insensitive comparison
    const moodText = extractedMood.toLowerCase();

    // Step 1: Check if the mood is a single word and matches a predefined mood
    const singleWordMatch = moodText.match(/^\w+$/);
    if (singleWordMatch) {
      const mood = singleWordMatch[0];
      if (predefinedMoods.includes(mood)) {
        return mood; // Direct match (e.g., "angry")
      }
      // Check if the single word maps to a predefined mood
      const mappedMood = moodMapping[mood];
      if (mappedMood) {
        return mappedMood; // Mapped match (e.g., "furious" → "angry")
      }
    }

    // Step 2: If not a single word, search for predefined moods or mapped moods in the description
    // First, try to find a predefined mood in the text
    for (const predefinedMood of predefinedMoods) {
      if (moodText.includes(predefinedMood)) {
        return predefinedMood; // Found a predefined mood in the description (e.g., "User is feeling angry" → "angry")
      }
    }

    // If no predefined mood is found, search for descriptive moods and map them
    for (const [descriptiveMood, standardMood] of Object.entries(moodMapping)) {
      if (moodText.includes(descriptiveMood)) {
        return standardMood; // Found a descriptive mood in the description (e.g., "User is feeling furious" → "angry")
      }
    }

    // Step 3: If no match is found, return "calm"
    return "calm";
  } catch (err) {
    console.log(err);
    return "calm";
  }
};

exports.standardizeSummary = (extractedSummary) => {
  // Default summary if the extracted summary is invalid
  try {
    const defaultSummary = "Conversation was stable with no strong emotion";

    // Check if the summary is null, undefined, empty, or not a string
    if (
      extractedSummary === null ||
      extractedSummary === undefined ||
      typeof extractedSummary !== "string" ||
      extractedSummary.trim() === ""
    ) {
      return defaultSummary;
    }

    // If the summary is valid, return it as-is
    return extractedSummary;
  } catch {
    return defaultSummary;
  }
};

exports.standardizeRepliesForUser1 = (extractedReplies, mood) => {
  // Define default replies for User1 for each mood

  const defaultRepliesForUser1 = {
    happy: [
      "I’m really glad we’re talking!",
      "This conversation is making my day!",
      "I’m feeling so positive right now.",
      "Let’s keep this cheerful vibe going!",
      "I appreciate your kind words!",
    ],
    angry: [
      "I’m not okay with how this is going.",
      "Can you stop upsetting me?",
      "I need some space right now.",
      "This isn’t working for me.",
      "I’m really frustrated with this.",
    ],
    sad: [
      "I’m feeling pretty down right now.",
      "This is really getting to me.",
      "I don’t know how to feel better.",
      "I’m just not in a good place.",
      "Can we talk about something else?",
    ],
    love: [
      "I really care about you.",
      "You mean a lot to me.",
      "I’m so happy we’re close.",
      "I feel so connected to you.",
      "You make me feel so loved.",
    ],
    calm: [
      "I’m feeling pretty relaxed now.",
      "This is a nice, calm chat.",
      "I appreciate the peaceful vibe.",
      "Let’s keep things smooth.",
      "I’m okay with how things are.",
    ],
  };
  try {
    // Validate that extractedReplies is a proper list (non-empty array of non-empty strings)
    const isValidList =
      Array.isArray(extractedReplies) &&
      extractedReplies.length > 0 &&
      extractedReplies.every(
        (reply) => typeof reply === "string" && reply.trim() !== ""
      );

    // If replies are not in a valid list format, return default replies for User1 based on mood
    if (!isValidList) {
      return defaultRepliesForUser1[mood] || defaultRepliesForUser1.calm; // Fallback to "calm" if mood is invalid
    }

    // If replies are valid, return them as-is (already in list format)
    return extractedReplies;
  } catch (err) {
    console.log(err);
    return defaultRepliesForUser1[mood];
  }
};
exports.standardizeRepliesForUser2 = (extractedReplies, mood) => {
  // Define default replies for User2 for each mood
  const defaultRepliesForUser2 = {
    happy: [
      "I’m happy to hear from you!",
      "This is such a pleasant chat.",
      "You’re making me smile!",
      "I’m enjoying our conversation.",
      "Let’s share more positivity!",
    ],
    angry: [
      "I didn’t mean to make you upset.",
      "Let’s try to sort this out calmly.",
      "I’m sorry if I angered you.",
      "Can we take a step back?",
      "I don’t want to argue with you.",
    ],
    sad: [
      "I’m sorry you’re feeling this way.",
      "Is there anything I can do to help?",
      "I hate seeing you so sad.",
      "Let’s try to cheer you up.",
      "I’m here for you, okay?",
    ],
    love: [
      "I care about you so much.",
      "You’re so special to me.",
      "I love how close we are.",
      "I feel so much affection for you.",
      "You make my heart happy.",
    ],
    calm: [
      "I’m glad we’re keeping this calm.",
      "This is a nice, steady conversation.",
      "I feel relaxed talking to you.",
      "Let’s maintain this peaceful tone.",
      "I’m good with how this is going.",
    ],
  };
  try {
    // Validate that extractedReplies is a proper list (non-empty array of non-empty strings)
    const isValidList =
      Array.isArray(extractedReplies) &&
      extractedReplies.length > 0 &&
      extractedReplies.every(
        (reply) => typeof reply === "string" && reply.trim() !== ""
      );

    // If replies are not in a valid list format, return default replies for User2 based on mood
    if (!isValidList) {
      return defaultRepliesForUser2[mood] || defaultRepliesForUser2.calm; // Fallback to "calm" if mood is invalid
    }

    // If replies are valid, return them as-is (already in list format)
    return extractedReplies;
  } catch (err) {
    console.log(err);
    return defaultRepliesForUser2[mood];
  }
};
