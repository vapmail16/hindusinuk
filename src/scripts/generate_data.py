import json
import os

# Create data directory if it doesn't exist
data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
os.makedirs(data_dir, exist_ok=True)

# Generate full_quiz_questions.json
quiz_questions = []
for level in range(1, 6):  # Levels 1 to 5
    for i in range(1, 21):  # 20 questions per level
        question_text = f"Sample Question {level}-{i}: What is the correct answer?"
        options = [
            {"text": "Correct Answer", "isCorrect": True},
            {"text": "Wrong Answer 1", "isCorrect": False},
            {"text": "Wrong Answer 2", "isCorrect": False},
            {"text": "Wrong Answer 3", "isCorrect": False}
        ]
        quiz_questions.append({
            "question": question_text,
            "options": options,
            "level": level
        })

quiz_file = os.path.join(data_dir, 'full_quiz_questions.json')
with open(quiz_file, "w") as f:
    json.dump(quiz_questions, f, indent=4)

# Generate full_mythology_stories.json
mythology_stories = [
    {
        "title": "The Govardhan Hill",
        "content": "Krishna lifted the Govardhan Hill to protect the villagers from a storm sent by Indra. This miraculous act taught the villagers to rely on faith rather than fear.",
        "moral": "Faith can overcome the greatest challenges."
    },
    {
        "title": "The Birth of Ganesha",
        "content": "Parvati created Ganesha from sandalwood paste, and when Shiva unknowingly beheaded him, he later restored his life by placing an elephant head on him.",
        "moral": "Even in adversity, transformation is possible."
    },
    {
        "title": "Hanuman's Leap",
        "content": "Young Hanuman leaped across the ocean to reach Lanka, displaying unwavering devotion and extraordinary strength.",
        "moral": "Devotion and courage can achieve the impossible."
    },
    {
        "title": "The Churning of the Ocean",
        "content": "Devas and asuras churned the ocean to obtain Amrit, leading to the emergence of many divine treasures.",
        "moral": "Cooperation brings great rewards."
    },
    {
        "title": "The Boar Avatar of Vishnu",
        "content": "Vishnu took the form of a boar to rescue the earth from being submerged in the cosmic ocean.",
        "moral": "Divine intervention can take many forms."
    },
    {
        "title": "Karna's Generosity",
        "content": "Karna, despite facing many hardships, was known for his unmatched generosity, always giving without expecting anything in return.",
        "moral": "True greatness lies in selfless giving."
    },
    {
        "title": "The Curse of Sage Durvasa",
        "content": "Sage Durvasa's curse led to unexpected changes, teaching even the gods about the balance of karma.",
        "moral": "Even curses can teach valuable lessons."
    },
    {
        "title": "The Story of Savitri",
        "content": "Savitri's unwavering determination brought her husband back from the clutches of death, symbolizing the power of love and devotion.",
        "moral": "Love and determination can conquer death."
    },
    {
        "title": "The Dance of Shiva",
        "content": "Lord Shiva's cosmic dance represents the cycle of creation and destruction, reminding us of the impermanence of life.",
        "moral": "Change is the only constant in life."
    },
    {
        "title": "Sita's Strength",
        "content": "Sita's courage and dignity during her trial by fire became a timeless lesson in resilience and honor.",
        "moral": "Strength comes from staying true to one's values."
    }
]

mythology_file = os.path.join(data_dir, 'full_mythology_stories.json')
with open(mythology_file, "w") as f:
    json.dump(mythology_stories, f, indent=4)

# Generate full_youtube_videos.json
youtube_videos = [
    {"title": "The Story of Ramayana", "url": "https://www.youtube.com/watch?v=VIDEO_ID_1", "videoId": "VIDEO_ID_1"},
    {"title": "The Story of Mahabharata", "url": "https://www.youtube.com/watch?v=VIDEO_ID_2", "videoId": "VIDEO_ID_2"},
    {"title": "Who is Lord Shiva?", "url": "https://www.youtube.com/watch?v=VIDEO_ID_3", "videoId": "VIDEO_ID_3"},
    {"title": "The Life of Lord Krishna", "url": "https://www.youtube.com/watch?v=VIDEO_ID_4", "videoId": "VIDEO_ID_4"},
    {"title": "The Legend of Hanuman", "url": "https://www.youtube.com/watch?v=VIDEO_ID_5", "videoId": "VIDEO_ID_5"},
    {"title": "Diwali - The Festival of Lights", "url": "https://www.youtube.com/watch?v=VIDEO_ID_6", "videoId": "VIDEO_ID_6"},
    {"title": "Why is Holi Celebrated?", "url": "https://www.youtube.com/watch?v=VIDEO_ID_7", "videoId": "VIDEO_ID_7"},
    {"title": "The Significance of Navratri", "url": "https://www.youtube.com/watch?v=VIDEO_ID_8", "videoId": "VIDEO_ID_8"},
    {"title": "The Story of Draupadi", "url": "https://www.youtube.com/watch?v=VIDEO_ID_9", "videoId": "VIDEO_ID_9"},
    {"title": "What is Karma in Hinduism?", "url": "https://www.youtube.com/watch?v=VIDEO_ID_10", "videoId": "VIDEO_ID_10"},
    {"title": "The Teachings of Bhagavad Gita", "url": "https://www.youtube.com/watch?v=VIDEO_ID_11", "videoId": "VIDEO_ID_11"}
]

youtube_file = os.path.join(data_dir, 'full_youtube_videos.json')
with open(youtube_file, "w") as f:
    json.dump(youtube_videos, f, indent=4)

print(f"JSON files have been generated in {data_dir}:")
print(f"1. {os.path.basename(quiz_file)}")
print(f"2. {os.path.basename(mythology_file)}")
print(f"3. {os.path.basename(youtube_file)}")
