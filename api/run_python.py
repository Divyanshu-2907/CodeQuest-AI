from http.server import BaseHTTPRequestHandler
import json
import sys
import io
import contextlib
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        # 1. SECURITY SANDBOX: Strip all environment variables 
        # so malicious user code cannot steal database credentials
        os.environ.clear()

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            req_body = json.loads(post_data.decode('utf-8'))
            code = req_body.get("code", "")
            
            stdout = io.StringIO()
            stderr = io.StringIO()
            exit_code = 0
            
            # Execute the python code, trapping print() and errors
            with contextlib.redirect_stdout(stdout), contextlib.redirect_stderr(stderr):
                try:
                    # Provide an empty namespace so they can't access existing imports easily
                    exec(code, {"__name__": "__main__"})
                except Exception as e:
                    print(e, file=sys.stderr)
                    exit_code = 1
                    
            res = {
                "stdout": stdout.getvalue(),
                "stderr": stderr.getvalue(),
                "exitCode": exit_code,
                "output": stdout.getvalue() + stderr.getvalue()
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(res).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
