#!/usr/bin/env python3
"""
win32com 修復伺服器
提供 API 端點來修復 win32com 快取問題
"""

import json
import traceback
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import win32com.client

class RepairHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """處理 CORS 預檢請求"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        """處理 POST 請求"""
        try:
            # 設定 CORS 標頭
            self.send_header('Access-Control-Allow-Origin', '*')
            
            # 解析 URL
            parsed_path = urlparse(self.path)
            
            if parsed_path.path == '/api/repair-win32com':
                self.handle_repair_request()
            else:
                self.send_error(404, "Endpoint not found")
                
        except Exception as e:
            self.send_error(500, f"Server error: {str(e)}")
            traceback.print_exc()

    def handle_repair_request(self):
        """處理 win32com 修復請求"""
        try:
            # 讀取請求內容
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            action = request_data.get('action')
            
            if action == 'rebuild-cache':
                # 執行 win32com 快取重建
                result = self.rebuild_win32com_cache()
                
                # 回傳結果
                response = {
                    'success': result['success'],
                    'message': result['message'],
                    'details': result.get('details', '')
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                
                self.wfile.write(json.dumps(response, ensure_ascii=False).encode('utf-8'))
            else:
                self.send_error(400, "Invalid action")
                
        except json.JSONDecodeError:
            self.send_error(400, "Invalid JSON")
        except Exception as e:
            error_response = {
                'success': False,
                'error': str(e),
                'message': '修復過程中發生錯誤'
            }
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps(error_response, ensure_ascii=False).encode('utf-8'))

    def rebuild_win32com_cache(self):
        """重建 win32com 快取"""
        try:
            # 重建快取
            win32com.client.gencache.Rebuild()
            
            # 測試 Excel COM 物件
            excel_app = win32com.client.Dispatch('Excel.Application')
            excel_app.Quit()
            
            return {
                'success': True,
                'message': 'win32com 快取重建成功',
                'details': '已清除損壞的快取並重新生成 COM 物件包裝器'
            }
            
        except Exception as e:
            return {
                'success': False,
                'message': 'win32com 快取重建失敗',
                'details': str(e)
            }

    def log_message(self, format, *args):
        """自定義日誌訊息格式"""
        print(f"[{self.address_string()}] {format % args}")

def run_server(port=8765):
    """啟動修復伺服器"""
    server_address = ('', port)
    httpd = HTTPServer(server_address, RepairHandler)
    
    print(f"🔧 win32com 修復伺服器已啟動")
    print(f"📡 服務地址: http://localhost:{port}")
    print(f"🎯 API 端點: http://localhost:{port}/api/repair-win32com")
    print(f"⚡ 按 Ctrl+C 停止伺服器")
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 伺服器已停止")
        httpd.server_close()

if __name__ == '__main__':
    # 檢查 win32com 是否可用
    try:
        import win32com.client
        print("✅ win32com 模組檢查通過")
    except ImportError:
        print("❌ 錯誤: 找不到 win32com 模組")
        print("請安裝 pywin32: pip install pywin32")
        exit(1)
    
    run_server()
