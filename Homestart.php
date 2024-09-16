<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weight Form</title>
    <!-- Tailwind CSS CDN -->
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">

    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 class="text-xl font-semibold mb-4">Submit Weights</h1>
        <form action="json_mapper.php" method="POST" class="space-y-4">
            <div>
                <label for="weight1" class="block text-gray-700">Weight 1</label>
                <input type="number" step="0.01" id="weight1" name="weight1" class="mt-1 p-2 border border-gray-300 rounded w-full" required>
            </div>
            <div>
                <label for="weight2" class="block text-gray-700">Weight 2</label>
                <input type="number" step="0.01" id="weight2" name="weight2" class="mt-1 p-2 border border-gray-300 rounded w-full" required>
            </div>
            <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Submit</button>
        </form>
    </div>

</body>
</html>
