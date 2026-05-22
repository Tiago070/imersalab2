<?php
// app/views/public/api.php
// Placeholder view file for API routing structure.
// The actual API responses are emitted directly by the controller.

http_response_code(200);
echo json_encode(['status' => 'success', 'data' => []], JSON_UNESCAPED_UNICODE);
