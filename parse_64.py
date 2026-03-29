import re
import json

def parse_mental_codes(filepath, outpath):
    # Try different encodings
    encodings = ['utf-8', 'utf-16', 'utf-16le', 'cp949', 'euc-kr']
    content = ""
    for enc in encodings:
        try:
            with open(filepath, 'r', encoding=enc) as f:
                content = f.read()
            print(f"Successfully read with encoding: {enc}")
            break
        except UnicodeDecodeError:
            continue
    
    if not content:
        print("Failed to read the file with known encodings.")
        return

    # Regular expressions for sections
    # Code \d{2}\. \[.*?\] .*?
    code_pattern = re.compile(r'Code (\d{2})\.\s*(\[.*?\][^\n]*)')
    
    codes = []
    
    # Split by "Code XX."
    parts = re.split(r'(Code \d{2}\.\s*\[)', content)
    
    if len(parts) < 3:
        print("No codes found.")
        return
        
    for i in range(1, len(parts), 2):
        code_header = parts[i] + parts[i+1] # "Code 01. [" + "EXP-01] ..."
        
        # Get code ID and Name
        match = re.match(r'Code (\d{2})\.\s*(\[.*?\][^\n]*)', code_header)
        if not match:
            continue
            
        code_id = f"CODE-{match.group(1)}"
        code_name = match.group(2).strip()
        
        # Extract the body 
        body = code_header[match.end():]
        
        # Basic extractions using regex or string splitting on headers
        dark_script_match = re.search(r'파괴적 인생 각본 \((.*?)\):\s*([^\n]+)', body)
        dark_title = dark_script_match.group(1).strip() if dark_script_match else ""
        dark_content = dark_script_match.group(2).strip() if dark_script_match else ""
        
        # Grab the text between "1단계" and "2단계", etc.
        phase1_match = re.search(r'1단계:\s*\[.*?\](.*?)(?=\n2단계:|\n\* 해킹 원리|\n[^\n]*2단계)', body, re.DOTALL)
        phase2_match = re.search(r'2단계:\s*\[.*?\](.*?)(?=\n3단계:|\n\* 해킹 원리|\n[^\n]*3단계)', body, re.DOTALL)
        phase3_match = re.search(r'3단계:\s*\[.*?\](.*?)(?=\n4단계:|\n\* 해킹 원리|\n[^\n]*4단계)', body, re.DOTALL)
        phase4_match = re.search(r'4단계:\s*\[.*?\](.*?)(?=\n💡 명심|\n[^\n]*💡)', body, re.DOTALL)
        briefing_match = re.search(r'💡 명심.*?브리핑\s*(.*?)(?=\nCode \d{2}|\n제\d장|\n\n\n|$)', body, re.DOTALL)
        
        def clean_text(m):
            return m.group(1).strip() if m else ""
            
        code_obj = {
            "id": code_id,
            "name": code_name,
            "darkMode": {
                "title": dark_title,
                "script": dark_content
            },
            "phase1": clean_text(phase1_match),
            "phase2": clean_text(phase2_match),
            "phase3": clean_text(phase3_match),
            "phase4": clean_text(phase4_match),
            "masterBriefing": clean_text(briefing_match)
        }
        
        codes.append(code_obj)
        
    print(f"Extracted {len(codes)} codes.")
    
    # Save to a temporary JSON or directly to TS file?
    # Generate TS file
    ts_content = "/**\n * Myeongsim Master - 64 Mental OS Codes Module\n * Generated automatically from the raw manuscript.\n */\n\n"
    ts_content += "export interface Mental64Module {\n"
    ts_content += "  id: string;\n"
    ts_content += "  name: string;\n"
    ts_content += "  darkMode: { title: string; script: string; };\n"
    ts_content += "  phase1: string;\n"
    ts_content += "  phase2: string;\n"
    ts_content += "  phase3: string;\n"
    ts_content += "  phase4: string;\n"
    ts_content += "  masterBriefing: string;\n"
    ts_content += "}\n\n"
    
    ts_content += f"export const mental64Data: Mental64Module[] = {json.dumps(codes, ensure_ascii=False, indent=2)};\n"
    
    with open(outpath, 'w', encoding='utf-8') as f:
        f.write(ts_content)
        
    print(f"Successfully wrote parsed data to {outpath}")

if __name__ == "__main__":
    parse_mental_codes("saju_data.md", "src/modules/mental64Modules.ts")
