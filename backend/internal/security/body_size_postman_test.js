// Generate 2MB of data
const sizeInMB = 2;
const sizeInBytes = sizeInMB * 1024 * 1024;

// Create a huge string
let hugeData = "x".repeat(sizeInBytes);

// Create JSON payload
const payload = {
    email: "test@test.com",
    password: "password1234",
    huge_field: hugeData
};

// Set as request body
pm.request.body.raw = JSON.stringify(payload);
pm.request.body.mode = "raw";
pm.request.body.options.raw.language = "json";

console.log(`Generated ${sizeInMB}MB request body`);