const NAME = 'Selia Image Visualizer';

const VERSION = '2.3.0';

const DESCRIPTION = 'Visualizer that uses 2D Canvas context to draw images onto an HTML canvas.';

const CONFIGURATION_SCHEMA = `{
    "$schema": "http://json-schema.org/draft-07/schema",
    "$id": "http://example.com/example.json",
    "type": "object",
    "title": "Selia Image Visualizer Configuration Schema",
    "description": "This is the JSON schema for the description of the configuration of the Selia Image Visualizer",
    "default": {},
    "examples": [
        {
            "scale": 1.0,
            "xOffset": 0.0,
            "yOffset": 0.0,
            "rotation": 0.0
        }
    ],
    "required": [
        "scale",
        "xOffset",
        "yOffset",
        "rotation"
    ],
    "additionalProperties": false,
    "properties": {
        "scale": {
            "$id": "#/properties/scale",
            "type": "number",
            "title": "scale",
            "description": "This is the relative size of the visualized image with respect to the smaller axis of the visualizer canvas.",
            "default": 0.0,
            "examples": [
                1.0
            ]
        },
        "xOffset": {
            "$id": "#/properties/xOffset",
            "type": "number",
            "title": "The xOffset schema",
            "description": "This is the relative offset in the x axis with respect to the canvas center. An offset of 0.5 means that the center is half of the canvas width away from its center.",
            "default": 0.0,
            "examples": [
                0.0
            ]
        },
        "yOffset": {
            "$id": "#/properties/yOffset",
            "type": "number",
            "title": "The yOffset schema",
            "description": "This is the relative offset in the y axis with respect to the canvas center. An offset of 0.5 means that the center is half of the canvas height away from its center.",
            "default": 0.0,
            "examples": [
                0.0
            ]
        },
        "rotation": {
            "$id": "#/properties/rotation",
            "type": "number",
            "title": "The rotation schema",
            "description": "Rotation of the image with respect to its center. In degrees.",
            "default": 0.0,
            "examples": [
                0.0
            ]
        }
    }
}`;

export {
  NAME,
  VERSION,
  DESCRIPTION,
  CONFIGURATION_SCHEMA,
};
