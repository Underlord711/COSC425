<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Define the path to your JSON file
    $jsonFilePath = 'graph_data.json';
    
    // Check if the JSON file exists
    if (!file_exists($jsonFilePath)) {
        echo json_encode(['error' => 'JSON file not found.']);
        exit;
    }

    // Get the weights from POST request
    $weight1 = isset($_POST['weight1']) ? floatval($_POST['weight1']) : 0;
    $weight2 = isset($_POST['weight2']) ? floatval($_POST['weight2']) : 0;

    // Read the existing JSON file
    $jsonContent = file_get_contents($jsonFilePath);
    $data = json_decode($jsonContent, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['error' => 'Invalid JSON format.']);
        exit;
    }

    // Update the JSON data based on field values
    foreach ($data as $key => $value) {
        if (isset($value['W'])) {
            $data[$key]['W'] = $weight1;
        } elseif (isset($value['M'])) {
            $data[$key]['M'] = $weight2;
        }
    }

    // Encode updated data to JSON
    $updatedJsonData = json_encode($data, JSON_PRETTY_PRINT);

    // Save the updated JSON back to the file
    if (file_put_contents($jsonFilePath, $updatedJsonData) === false) {
        echo json_encode(['error' => 'Failed to write to JSON file.']);
        exit;
    }

    // Return the updated JSON data
    header('Content-Type: application/json');
    echo $updatedJsonData;
}
?>
