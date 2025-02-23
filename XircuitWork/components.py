import json
from xai_components.base import InArg, OutArg, Component

# Component 1: Read JSON Data
class ReadJSON(Component):
    file_path: InArg[str]
    data: OutArg[list]

    def __init__(self):
        self.file_path = InArg("data.json")  # Default filename
        self.data = OutArg([])

    def execute(self, ctx):
        with open(self.file_path.value, "r") as file:
            self.data.value = json.load(file)
        print("Loaded JSON Data:", self.data.value)

# Component 2: Generate Work Schedule
class GenerateSchedule(Component):
    data: InArg[list]
    schedule: OutArg[dict]

    def __init__(self):
        self.data = InArg([])
        self.schedule = OutArg({})

    def execute(self, ctx):
        if not self.data.value:
            print("No data available!")
            return
        
        user_data = self.data.value[0]  # Assume single-user input
        name = user_data.get("firstName", "Unknown")
        days = user_data.get("daysAvailability", [])
        free_time = user_data.get("freeTime", "None")
        work_pref = user_data.get("workPreference", {})

        # Generate recommendation
        work_schedule = {
            "name": name,
            "work_days": days,
            "recommendation": "Remote work preferred" if work_pref.get("remote") else "Onsite work preferred",
            "suggested_activity": f"Consider doing {free_time} in your free time."
        }

        self.schedule.value = work_schedule
        print("Generated Work Schedule:", self.schedule.value)
