from flask import Flask, request, jsonify

app = Flask(__name__)

cocktails = [
    {
        "id": 1,
        "name": "Negroni",
        "ingredients": [
            {
                "ingredient": "Campari",
                "measurement": 30,
            },
            {
                "ingredient": "Sweet Vermouth",
                "measurement": 30,
            },
            {
                "ingredient": "Gin",
                "measurement": 30,
            },
        ],
        "style": "stirred",
        "origin": "Florence, Italy",
        "garnish": "Orange wheel or orange peel",
        "profiles": ["bitter"],
    },
    {
        "id": 2,
        "name": "Old Fashioned",
        "ingredients": [
            {
                "ingredient": "Whiskey",
                "measurement": 60,
            },
            {
                "ingredient": "Simple Syrup",
                "measurement": 15,
            },
            {
                "ingredient": "Angostura",
                "measurement": 3,
            },
        ],
        "style": "stirred",
        "origin": "Louisville, Kentucky",
        "garnish": "Orange peel twist",
        "profiles": ["bitter", "sweet"],
    },
]


def _find_next_id():
    return max(cocktail["id"] for cocktail in cocktails) + 1


@app.get("/cocktails")
def get_cocktails():
    return jsonify(cocktails)


@app.post("/cocktails")
def add_cocktail():
    if request.is_json:
        cocktail = request.get_json()
        cocktail["id"] = _find_next_id()
        cocktails.append(cocktail)
        return cocktail, 201
    return {"error": "Request must be JSON"}, 415
