#!/usr/bin/env python3
import json
import re
import sys

def fix_json_file(input_file, output_file):
    """Fix JSON file by properly handling NaN values and syntax errors"""
    
    print(f"Reading {input_file}...")
    
    # Read the file as text first to fix syntax issues
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Fixing syntax errors...")
    
    # Fix common issues from find/replace operations
    # Fix triple quotes
    content = re.sub(r'"""([^"]*)"', r'"\1"', content)
    
    # Fix any remaining NaN values that weren't properly quoted
    content = re.sub(r':\s*NaN\s*([,}])', r': null\1', content)
    
    # Fix any unquoted NaN values
    content = re.sub(r'"NaN"', r'null', content)
    
    print("Parsing JSON...")
    
    try:
        # Parse the JSON
        data = json.loads(content)
        print(f"Successfully parsed {len(data)} records")
        
        # Clean the data
        print("Cleaning data...")
        cleaned_data = []
        
        for record in data:
            cleaned_record = {}
            for key, value in record.items():
                # Convert null values to empty strings for consistency
                if value is None:
                    cleaned_record[key] = ""
                elif isinstance(value, str) and value.strip() == "":
                    cleaned_record[key] = ""
                else:
                    cleaned_record[key] = value
            cleaned_data.append(cleaned_record)
        
        # Write the cleaned JSON
        print(f"Writing cleaned data to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(cleaned_data, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully created {output_file} with {len(cleaned_data)} records")
        return True
        
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        
        # Try to find and fix the specific error
        lines = content.split('\n')
        error_line = e.lineno - 1 if e.lineno else 0
        
        print(f"Error around line {e.lineno}:")
        start = max(0, error_line - 2)
        end = min(len(lines), error_line + 3)
        
        for i in range(start, end):
            marker = " >>> " if i == error_line else "     "
            print(f"{marker}{i+1:6d}: {lines[i]}")
        
        return False
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

if __name__ == "__main__":
    input_file = "public/cemetery_records_structured.json"
    output_file = "public/cemetery_records_fixed.json"
    
    if fix_json_file(input_file, output_file):
        print("\n✅ JSON file has been fixed!")
        print(f"Original file: {input_file}")
        print(f"Fixed file: {output_file}")
        print("\nYou can now update your App.tsx to use cemetery_records_fixed.json")
    else:
        print("\n❌ Failed to fix JSON file")
        sys.exit(1)
