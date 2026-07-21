import { prisma } from '../src/lib/db'

async function main() {
  console.log('Seeding chapters and missions...')

  const chaptersData = [
    {
      number: 1,
      title: "The Awakening",
      lore: "You wake up with a neural implant that gives you access to the city's hidden data streams. Master the basics of Python syntax, data processing, and analysis.",
      unlockXp: 0,
      isLocked: false,
      npcName: "Ghost",
      npcRole: "Underground Guide",
      npcPersona: "Ex-corporate data scientist turned underground. Cryptic but helpful. Speaks in terse, data-driven metaphors.",
      missions: [
        {
          title: "Mission 1.1: Systems Uplink",
          type: "MAIN",
          briefing: "Welcome to Neural City. The corporate watchdogs are sniffing around your sector, but we can blind them if we spoof our connection variables. Create two variables, `agent_handle` as 'Specter' and `uplink_key` as 9482, then print them using f-strings to establish a baseline connection.",
          starterCode: `# SPOOF SYSTEM VARIABLES
# TODO: Define agent_handle as a string "Specter"
# TODO: Define uplink_key as an integer 9482

agent_handle = ""
uplink_key = 0

print(f"Uplink active: {agent_handle} with key {uplink_key}")`,
          judgeHint: "Check that agent_handle is set to 'Specter', and uplink_key is set to 9482. Confirm the printed output matches the spoof message.",
          xpReward: 100,
          isLocked: false
        },
        {
          title: "Mission 1.2: Array Mapping",
          type: "MAIN",
          briefing: "Excellent, we're inside the district node. Now we need to process a grid of security cameras using NumPy. Construct a 3x3 array containing values 1 to 9 representing the camera grid, and calculate the mean status code. Vex needs this data to plan our escape route through the alleyways.",
          starterCode: `import numpy as np

# Create a 3x3 NumPy array with values 1 to 9
# Compute the mean of the array

grid = np.array([]) # TODO: Create 3x3 array
mean_val = 0.0      # TODO: Calculate mean

print(f"Grid shape: {grid.shape}")
print(f"Grid Mean: {mean_val}")`,
          judgeHint: "Check that the numpy array 'grid' is a 3x3 matrix containing values from 1 to 9. Verify that 'mean_val' is calculated as 5.0.",
          xpReward: 150,
          isLocked: true
        },
        {
          title: "Mission 1.3: Database Infiltration",
          type: "SIDE",
          briefing: "We found a stray corporate database containing user data. Load the data using Pandas, clean it up, and filter for active employees only. You need to return a filtered DataFrame showing only records where the 'status' column is 'Active'. Don't let their sysadmins spot this query.",
          starterCode: `import pandas as pd

# Sample corporate payroll data
data = {
    'employee': ['Adam', 'Eve', 'Cain', 'Abel'],
    'role': ['Admin', 'Developer', 'Security', 'Operator'],
    'status': ['Active', 'Active', 'Terminated', 'Active']
}

df = pd.DataFrame(data)

# TODO: Filter df for employees where status is "Active"
active_df = df

print(active_df)`,
          judgeHint: "Verify that active_df is a filtered Pandas DataFrame containing only rows where the status is 'Active'. Row count should be 3 (excluding Cain).",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 1.4: The District Boss",
          type: "BOSS",
          briefing: "The Sector AI is trying to isolate our gateway! It's flooding us with anomalous transaction packets. Load the transactions into a Pandas DataFrame, calculate the mean transaction value, and identify any transactions exceeding 1000 units so we can drop them. We need to clear this block before they block us permanently.",
          starterCode: `import pandas as pd
import numpy as np

transactions = pd.DataFrame({
    'id': [101, 102, 103, 104, 105],
    'amount': [120.5, 450.0, 1500.2, 89.9, 2100.0]
})

# TODO: Calculate the overall mean of 'amount'
# TODO: Find transaction ids where amount > 1000

mean_amount = 0.0
anomalous_ids = []

print(f"Mean amount: {mean_amount}")
print(f"Anomalies: {anomalous_ids}")`,
          judgeHint: "Check that mean_amount is calculated as 852.12. Verify anomalous_ids contains [103, 105]. Ensure both variables are computed correctly using Pandas.",
          xpReward: 300,
          isLocked: true
        }
      ]
    },
    {
      number: 2,
      title: "Control Flow City",
      lore: "The megacorp's security drones operate on simple logic loops. Learn to hijack them using conditionals, feature engineering, and scikit-learn models.",
      unlockXp: 500,
      isLocked: true,
      npcName: "Vex",
      npcRole: "Streetwise Smuggler",
      npcPersona: "A streetwise data smuggler. Impatient, slang-heavy, respects those who can bypass security quickly.",
      missions: [
        {
          title: "Mission 2.1: Feature Refiner",
          type: "MAIN",
          briefing: "We are intercepting biometric data from the control towers. The raw telemetry contains missing values and unscaled features. Write a feature engineering script to fill missing values with 0 and scale the 'signal' column by dividing it by the max value. Vex says this will stabilize our drone interceptor targets.",
          starterCode: `import pandas as pd
import numpy as np

data = pd.DataFrame({
    'device_id': [1, 2, 3, 4],
    'signal': [45.0, np.nan, 90.0, 30.0]
})

# TODO: Fill missing signal values with 0
# TODO: Scale the 'signal' column by dividing by its maximum value

print(data)`,
          judgeHint: "Check that the missing value in row 2 is replaced with 0. Verify that the 'signal' values are scaled correctly (row 3 max signal becomes 1.0, other values are 0.5, 0.0, 0.3333).",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 2.2: Infiltration Split",
          type: "MAIN",
          briefing: "We need to train a model to predict drone flight paths. To avoid overfitting, we must split our telemetry logs into training and validation sets. Write a function that splits a dataset of 100 rows into an 80/20 train/test split using sklearn. Use random_state=42.",
          starterCode: `from sklearn.model_selection import train_test_split
import numpy as np

# Generate 100 samples
X = np.arange(100).reshape(100, 1)
y = np.arange(100)

# TODO: Split X and y into 80% train and 20% test
# Use random_state=42

X_train, X_test, y_train, y_test = None, None, None, None

print(f"Train size: {len(X_train)}, Test size: {len(X_test)}")`,
          judgeHint: "Ensure train_test_split is used with test_size=0.2 and random_state=42. Confirm X_train size is 80 and X_test size is 20.",
          xpReward: 150,
          isLocked: true
        },
        {
          title: "Mission 2.3: Automation Pipeline",
          type: "SIDE",
          briefing: "Corporate security has updated their firewalls. We need a scikit-learn Pipeline to automate feature scaling and classification. Create a simple pipeline that uses StandardScaler followed by a LogisticRegression classifier. Fit the pipeline on the sample training vectors provided.",
          starterCode: `from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import numpy as np

X = np.array([[10.0, 0.5], [20.0, 1.2], [15.0, 0.8], [30.0, 2.5]])
y = np.array([0, 0, 1, 1])

# TODO: Create a pipeline with 'scaler' (StandardScaler) and 'classifier' (LogisticRegression)
# TODO: Fit the pipeline on X and y
pipeline = None

print(pipeline)`,
          judgeHint: "Check that the pipeline contains 'scaler' (StandardScaler) and 'classifier' (LogisticRegression) steps. Verify that the pipeline has been successfully fitted on the X and y inputs.",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 2.4: Model Evaluation",
          type: "BOSS",
          briefing: "The Control Tower firewall is falling, but we need to verify our intrusion model before executing the payload. Calculate the model's accuracy, precision, and recall scores using Scikit-Learn. The actual target indicators and our model's predictions are provided below. A mistake here locks us out of the mainframe forever!",
          starterCode: `from sklearn.metrics import accuracy_score, precision_score, recall_score
import numpy as np

y_true = np.array([1, 0, 1, 1, 0, 1, 0, 0, 1, 0])
y_pred = np.array([1, 0, 1, 0, 0, 1, 1, 0, 1, 0])

# TODO: Calculate accuracy, precision, and recall
accuracy = 0.0
precision = 0.0
recall = 0.0

print(f"Acc: {accuracy:.2f}, Prec: {precision:.2f}, Rec: {recall:.2f}")`,
          judgeHint: "Verify that accuracy is calculated as 0.80, precision is 0.80, and recall is 0.80 based on the target arrays. Make sure they use sklearn.metrics.",
          xpReward: 300,
          isLocked: true
        }
      ]
    },
    {
      number: 3,
      title: "Data Structures District",
      lore: "Information is power. Learn to store, retrieve, and manipulate data using text embeddings, vector stores, and retrieval-augmented generation pipelines.",
      unlockXp: 1500,
      isLocked: true,
      npcName: "Nexus",
      npcRole: "AI Ethics Hacker",
      npcPersona: "An AI ethics hacker. Calm, philosophical, views code as the building blocks of a better society.",
      missions: [
        {
          title: "Mission 3.1: Vector Alignment",
          type: "MAIN",
          briefing: "Welcome to the Data Structures District. Nexus wants us to build a semantic search tool to parse encrypted corporate emails. Write a cosine similarity function in Python using NumPy to measure the angle between two word vectors. The higher the similarity, the closer the match.",
          starterCode: `import numpy as np

vector_a = np.array([0.2, 0.8, 0.5])
vector_b = np.array([0.1, 0.9, 0.4])

# TODO: Calculate the cosine similarity between vector_a and vector_b
# Cosine Similarity = (A . B) / (||A|| * ||B||)

similarity = 0.0

print(f"Cosine Similarity: {similarity:.4f}")`,
          judgeHint: "Check that the cosine similarity is calculated correctly using dot products and norms. The resulting value should be approximately 0.9856.",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 3.2: Vector Store Indexing",
          type: "MAIN",
          briefing: "Our targets are storing data keys inside high-dimensional tables. Build a simple Vector Store class in Python that stores text documents alongside their dense embeddings. Write a method to query the store and return the document closest to a query vector based on Cosine Similarity.",
          starterCode: `import numpy as np

class MinimalVectorStore:
    def __init__(self):
        self.docs = []
        self.embeddings = []
        
    def add(self, text, embedding):
        self.docs.append(text)
        self.embeddings.append(np.array(embedding))
        
    def query(self, query_emb):
        # TODO: Return the document that has the highest cosine similarity with query_emb
        return ""

store = MinimalVectorStore()
store.add("Encrypted log 1", [0.1, 0.9])
store.add("Decrypted key memo", [0.9, 0.1])

best_doc = store.query([0.8, 0.2])
print(f"Match: {best_doc}")`,
          judgeHint: "Check that query returns 'Decrypted key memo' for the query vector [0.8, 0.2] since it is closer to [0.9, 0.1] than [0.1, 0.9]. Verify cosine similarity comparison logic is fully functional.",
          xpReward: 150,
          isLocked: true
        },
        {
          title: "Mission 3.3: RAG Assembly",
          type: "SIDE",
          briefing: "Nexus needs us to construct a Retrieval-Augmented Generation (RAG) context template. Take the retrieved document from our database and format it into a clean LLM prompt context block. If the retrieved text is empty, supply a default fallback warning so the LLM doesn't hallucinate credentials.",
          starterCode: `def format_rag_prompt(question, context):
    # TODO: Construct a prompt string embedding 'context' and 'question'
    # If context is empty or None, use "No corporate documents found."
    
    formatted_prompt = ""
    return formatted_prompt

prompt = format_rag_prompt("What is the gate key?", "The gate key is NEURAL_GATE_2026.")
print(prompt)`,
          judgeHint: "Check that format_rag_prompt builds a coherent context block. Verify that when context is empty or None, the warning 'No corporate documents found.' is placed in the prompt.",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 3.4: Retrieval Ranker",
          type: "BOSS",
          briefing: "Megacorp's security algorithms are returning noisy search results. We need to filter and re-rank the retrieved chunks. Take a list of texts and their similarity scores, filter out any with scores below 0.5, and sort the remainder in descending order. Make no mistakes, this dataset maps the central vault!",
          starterCode: `results = [
    {"text": "Sub-level 1 map", "score": 0.45},
    {"text": "Mainframe layout blueprint", "score": 0.88},
    {"text": "Security patrol rotations", "score": 0.62},
    {"text": "Coffee machine schedules", "score": 0.12}
]

# TODO: Filter out items with score < 0.5
# TODO: Sort the remaining items by score descending

filtered_and_sorted = []

print(filtered_and_sorted)`,
          judgeHint: "Check that elements with scores less than 0.5 (Sub-level 1 map and Coffee machine schedules) are discarded. Verify the final sorted array has 'Mainframe layout blueprint' (0.88) first, followed by 'Security patrol rotations' (0.62).",
          xpReward: 300,
          isLocked: true
        }
      ]
    },
    {
      number: 4,
      title: "The Function Factory",
      lore: "Automation is key to survival. Build reusable custom tools, message window memories, ReAct loops, and agent orchestrators to scale up your cyber operations.",
      unlockXp: 3000,
      isLocked: true,
      npcName: "Cipher",
      npcRole: "Rogue Agent Builder",
      npcPersona: "A rogue agent builder. Pragmatic, militaristic tone. Treats every piece of code like a weapon in an ongoing war.",
      missions: [
        {
          title: "Mission 4.1: Tool Decorator",
          type: "MAIN",
          briefing: "Welcome to The Function Factory. Cipher wants us to register custom code blocks as agent tools. Write a Python decorator function `agent_tool` that adds metadata (a `name` and `description` attribute) to any decorated function so our LLM orchestrator can discover it.",
          starterCode: `def agent_tool(name, description):
    # TODO: Implement a decorator that assigns 'name' and 'description' properties to the function
    def decorator(func):
        return func
    return decorator

@agent_tool("sql_runner", "Executes secure database queries.")
def run_query(query):
    return f"Executing: {query}"
    
print(run_query.name)
print(run_query.description)`,
          judgeHint: "Check that run_query.name returns 'sql_runner' and run_query.description returns 'Executes secure database queries.' confirming that the decorator correctly attaches metadata to functions.",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 4.2: Buffer Memory",
          type: "MAIN",
          briefing: "To evade automated detection, our hacking agent must remember the context of its session without storing logs permanently. Write a simple Conversation Memory Buffer class that holds a rolling window of the last `N` chat messages. If the buffer is full, remove the oldest message.",
          starterCode: `class RollingBufferMemory:
    def __init__(self, limit=3):
        self.limit = limit
        self.buffer = []
        
    def add_message(self, role, content):
        # TODO: Append the message to self.buffer
        # If buffer exceeds the limit, remove the oldest message (FIFO)
        pass

memory = RollingBufferMemory(limit=2)
memory.add_message("user", "Init hack")
memory.add_message("assistant", "Ready")
memory.add_message("user", "Bypass gateway")

print(memory.buffer)`,
          judgeHint: "Verify that the buffer size is restricted to 2. Confirm the oldest message ('user': 'Init hack') is discarded, leaving 'assistant': 'Ready' and 'user': 'Bypass gateway' in the memory buffer.",
          xpReward: 150,
          isLocked: true
        },
        {
          title: "Mission 4.3: ReAct Step Execution",
          type: "SIDE",
          briefing: "Cipher wants us to execute a single step of a ReAct (Reasoning + Acting) loop. Parse a text response from the LLM, extract the 'Action:' name and 'Action Input:' parameter, and execute the corresponding function from our tool dictionary. This is how agents interact with the grid.",
          starterCode: `llm_output = "Thought: I need to scan the network.\\nAction: port_scanner\\nAction Input: 192.168.1.1"

tools = {
    "port_scanner": lambda ip: f"Scanning {ip}..."
}

# TODO: Parse 'Action' and 'Action Input' from llm_output
# TODO: Call the corresponding tool and return the output

result = ""

print(result)`,
          judgeHint: "Confirm that 'port_scanner' and '192.168.1.1' are successfully extracted. Verify the lambda function is triggered, yielding the string 'Scanning 192.168.1.1...'.",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 4.4: Agent Orchestrator",
          type: "BOSS",
          briefing: "The System Admin is locking down the sector! We need to execute a multi-step agent plan, handling any intermediate tool exceptions. If a tool execution fails with an error, capture the error message, feed it back into the agent's scratchpad as feedback, and continue the execution loop.",
          starterCode: `def run_agent_step(tool_name, tool_input, tools):
    # TODO: Execute tool_name from tools dict with tool_input.
    # If an exception is raised, return the string: "Error: [exception message]"
    try:
        return ""
    except Exception as e:
        return ""

test_tools = {
    "ssh_uplink": lambda ip: exec("raise ValueError('Connection timeout')")
}

status = run_agent_step("ssh_uplink", "10.0.0.1", test_tools)
print(status)`,
          judgeHint: "Check that the run_agent_step function catches the ValueError thrown by the ssh_uplink tool and formats it as 'Error: Connection timeout' instead of letting the application crash.",
          xpReward: 300,
          isLocked: true
        }
      ]
    },
    {
      number: 5,
      title: "Object Oriented Outlands",
      lore: "The final frontier. Master complex fine-tuning pipelines, model serving via REST APIs, drift evaluation, and full training systems to liberate the grid.",
      unlockXp: 5000,
      isLocked: true,
      npcName: "The Architect",
      npcRole: "System Admin",
      npcPersona: "The mysterious AI overlord's right hand. Cold, calculating, arrogant. Believes human code is fundamentally flawed.",
      missions: [
        {
          title: "Mission 5.1: Prompt Formatter",
          type: "MAIN",
          briefing: "Welcome to the Object Oriented Outlands. We are preparing dataset prompts to fine-tune our custom language model. Write a utility function that converts a row of prompt-response strings into a structured JSONL (JSON Lines) string compliant with fine-tuning formats. Standardize the keys to 'prompt' and 'completion'.",
          starterCode: `import json

dataset = [
    {"input": "hack mainframe", "output": "executing payload"},
    {"input": "status", "output": "all systems operational"}
]

# TODO: Convert dataset rows to JSONL string format (one JSON object per line)
# Output keys must be 'prompt' and 'completion'

jsonl_output = ""

print(jsonl_output)`,
          judgeHint: "Ensure each line in the output is a valid JSON string containing the keys 'prompt' and 'completion'. Confirm two separate lines are created.",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 5.2: Model Server Endpoint",
          type: "MAIN",
          briefing: "The Architect is monitoring the network, so we must disguise our models as a regular FastAPI web service. Define a mock route handler for a POST endpoint \`/predict\` that takes a JSON body containing a 'text' prompt and returns a predicted 'sentiment_score' calculated by the length of the string modulo 10 divided by 10.",
          starterCode: `# Define a predict function that acts as a router endpoint
# Input is a dict: {"text": str}
# Output is a dict: {"sentiment_score": float}

def predict_endpoint(payload):
    text = payload.get("text", "")
    # TODO: Calculate sentiment score = (len(text) % 10) / 10.0
    score = 0.0
    return {"sentiment_score": score}

res = predict_endpoint({"text": "access_granted"})
print(res)`,
          judgeHint: "Verify that predict_endpoint takes a payload with a 'text' key. For 'access_granted' (length 14), the sentiment_score should be (14 % 10) / 10.0 = 0.4.",
          xpReward: 150,
          isLocked: true
        },
        {
          title: "Mission 5.3: Monitoring & Drift",
          type: "SIDE",
          briefing: "Our model is degrading due to concept drift in corporate communications. Calculate the Mean Squared Error (MSE) between our model's predicted risk scores and the actual labels evaluated by our systems. If the MSE exceeds 0.3, set a warning flag.",
          starterCode: `import numpy as np

y_actual = np.array([0.1, 0.9, 0.4, 0.8])
y_pred = np.array([0.15, 0.7, 0.3, 0.95])

# TODO: Calculate Mean Squared Error (MSE)
# TODO: Set drift_warning = True if MSE > 0.3 else False

mse = 0.0
drift_warning = False

print(f"MSE: {mse:.4f}, Warning: {drift_warning}")`,
          judgeHint: "Confirm MSE is calculated correctly as 0.0175. Verify drift_warning is False since the MSE does not exceed 0.3.",
          xpReward: 100,
          isLocked: true
        },
        {
          title: "Mission 5.4: The Core Mainframe",
          type: "BOSS",
          briefing: "This is it, the central AI mainframe. We must execute our full fine-tuning, evaluation, and server deployment pipeline in one final step. Construct a complete Python class \`MainframeOrchestrator\` that ingests data, filters outliers, scores predictions, and calculates metrics. Execute this to take down the System Admin once and for all!",
          starterCode: `import numpy as np

class MainframeOrchestrator:
    def __init__(self, data):
        self.data = np.array(data)
        
    def clean_data(self):
        # TODO: Remove values <= 0
        pass
        
    def evaluate_mse(self, predictions):
        # TODO: Calculate MSE between self.data and predictions
        return 0.0

orchestrator = MainframeOrchestrator([10, -5, 20, 30])
orchestrator.clean_data()
# Data is now [10, 20, 30]

mse = orchestrator.evaluate_mse([12, 18, 33])
print(f"Final Mainframe Status: Data clean. MSE is {mse:.2f}")`,
          judgeHint: "Check that clean_data filters out -5. Verify that evaluate_mse calculates the mean squared error between [10, 20, 30] and [12, 18, 33], which is ((10-12)^2 + (20-18)^2 + (30-33)^2)/3 = (4 + 4 + 9)/3 = 5.67.",
          xpReward: 300,
          isLocked: true
        }
      ]
    }
  ];

  for (const cData of chaptersData) {
    const chapter = await prisma.chapter.upsert({
      where: { number: cData.number },
      update: {
        title: cData.title,
        lore: cData.lore,
        unlockXp: cData.unlockXp,
        isLocked: cData.isLocked,
        npcName: cData.npcName,
        npcRole: cData.npcRole,
        npcPersona: cData.npcPersona,
      },
      create: {
        number: cData.number,
        title: cData.title,
        lore: cData.lore,
        unlockXp: cData.unlockXp,
        isLocked: cData.isLocked,
        npcName: cData.npcName,
        npcRole: cData.npcRole,
        npcPersona: cData.npcPersona,
      }
    });

    console.log(`Synced chapter: ${chapter.title}`);

    for (const mData of cData.missions) {
      await prisma.mission.upsert({
        where: {
          id: `${chapter.id}-${mData.title.replace(/\s+/g, '-').toLowerCase()}` // Keep seeding repeatable
        },
        update: {
          title: mData.title,
          type: mData.type as any,
          briefing: mData.briefing,
          starterCode: mData.starterCode,
          judgeHint: mData.judgeHint,
          xpReward: mData.xpReward,
          isLocked: mData.isLocked,
        },
        create: {
          id: `${chapter.id}-${mData.title.replace(/\s+/g, '-').toLowerCase()}`,
          chapterId: chapter.id,
          title: mData.title,
          type: mData.type as any,
          briefing: mData.briefing,
          starterCode: mData.starterCode,
          judgeHint: mData.judgeHint,
          xpReward: mData.xpReward,
          isLocked: mData.isLocked,
        }
      });
    }
    console.log(`Synced missions for chapter ${chapter.number}`);
  }

  const badgesData = [
    { name: "First Blood", description: "Complete your first mission.", iconName: "Droplet" },
    { name: "Data Runner", description: "Complete Chapter 1.", iconName: "Database" },
    { name: "On Fire", description: "Achieve a 7-day streak.", iconName: "Flame" },
    { name: "Speed Demon", description: "Complete a boss mission in under 20 minutes.", iconName: "Zap" },
    { name: "Perfectionist", description: "Score 100 on an AI judge evaluation.", iconName: "CheckCircle" },
    { name: "Neural Architect", description: "Reach Level 10.", iconName: "Cpu" },
    { name: "The Overlord", description: "Complete all chapters.", iconName: "Crown" },
    { name: "Inner Circle", description: "Upgrade to Pro status.", iconName: "Shield" },
  ];

  for (const badge of badgesData) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {
        description: badge.description,
        iconName: badge.iconName
      },
      create: badge
    });
  }
  console.log('Seeded badges.');

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
