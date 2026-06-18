export const LANGUAGES = [
    {
      value: 'javascript',
      label: 'JavaScript',
      monacoLang: 'javascript', 
      defaultCode: `// JavaScript
  console.log("Hello, World!");
  
  function greet(name) {
    return \`Hello, \${name}!\`;
  }
  
  console.log(greet("Deepak"));`,
    },
    {
      value: 'python',
      label: 'Python',
      monacoLang: 'python',
      defaultCode: `# Python
  print("Hello, World!")
  
  def greet(name):
      return f"Hello, {name}!"
  
  print(greet("Deepak"))`,
    },
    {
      value: 'cpp',
      label: 'C++',
      monacoLang: 'cpp',
      defaultCode: `#include <iostream>
  using namespace std;
  
  int main() {
      cout << "Hello, World!" << endl;
      return 0;
  }`,
    },
    {
      value: 'java',
      label: 'Java',
      monacoLang: 'java',
      defaultCode: `public class Main {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }`,
    },
    {
      value: 'typescript',
      label: 'TypeScript',
      monacoLang: 'typescript',
      defaultCode: `// TypeScript
  const greet = (name: string): string => {
    return \`Hello, \${name}!\`;
  };
  
  console.log(greet("Deepak"));`,
    },
    {
      value: 'go',
      label: 'Go',
      monacoLang: 'go',
      defaultCode: `package main
  
  import "fmt"
  
  func main() {
      fmt.Println("Hello, World!")
  }`,
    },
    {
      value: 'rust',
      label: 'Rust',
      monacoLang: 'rust',
      defaultCode: `fn main() {
      println!("Hello, World!");
  }`,
    },
    {
      value: 'html',
      label: 'HTML',
      monacoLang: 'html',
      defaultCode: `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>My Page</title>
  </head>
  <body>
      <h1>Hello, World!</h1>
  </body>
  </html>`,
    },
    {
      value: 'css',
      label: 'CSS',
      monacoLang: 'css',
      defaultCode: `/* CSS */
  body {
    font-family: sans-serif;
    background: #1a1a2e;
    color: white;
  }`,
    },
    {
      value: 'sql',
      label: 'SQL',
      monacoLang: 'sql',
      defaultCode: `-- SQL
  SELECT * FROM users
  WHERE active = true
  ORDER BY created_at DESC;`,
    },
  ]
  export const getLanguage = (value) => {
    return LANGUAGES.find((l) => l.value === value) || LANGUAGES[0]
  }