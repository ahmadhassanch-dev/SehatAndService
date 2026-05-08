import os
import re

def replace_colors(content):
    # Mapping of colors to blue equivalents
    replacements = {
        'yellow-50': 'blue-50',
        'yellow-100': 'blue-100',
        'yellow-500': 'blue-500',
        'yellow-600': 'blue-600',
        'yellow-800': 'blue-800',
        'amber-500': 'blue-500',
        'amber-600': 'blue-600',
        'amber-700': 'blue-700',
        'amber-800': 'blue-800',
        'amber-900': 'blue-900',
        'orange-100': 'blue-100',
        'orange-500': 'blue-500',
        'orange-700': 'blue-700',
        'orange-800': 'blue-800',
        'orange-900': 'blue-900',
    }
    
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    return content

def main():
    root_dir = 'frontend/src'
    for root, dirs, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.css')):
                file_path = os.path.join(root, file)
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                new_content = replace_colors(content)
                
                if new_content != content:
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Updated {file_path}")

if __name__ == "__main__":
    main()
