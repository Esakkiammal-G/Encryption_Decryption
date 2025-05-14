// This is a simplified implementation for demo purposes
// In a real application, you would use a proper encryption library

/**
 * Encrypts the given text using the specified algorithm and password
 */
export function encrypt(text: string, password: string, algorithm: string): string {
  // In a real application, you would use a proper encryption library
  // This is a simplified version for demonstration
  
  if (!text || !password) {
    throw new Error('Text and password are required');
  }

  // Simple encryption for demo - NOT for production use
  const encrypted = btoa(
    algorithm + 
    ':' + 
    text.split('').map((char) => {
      const charCode = char.charCodeAt(0);
      const passwordChar = password.charCodeAt(0);
      return String.fromCharCode(charCode + passwordChar);
    }).join('')
  );

  return encrypted;
}

/**
 * Decrypts the given text using the specified algorithm and password
 */
export function decrypt(encryptedText: string, password: string, algorithm: string): string {
  // In a real application, you would use a proper encryption library
  // This is a simplified version for demonstration
  
  if (!encryptedText || !password) {
    throw new Error('Encrypted text and password are required');
  }

  try {
    const decoded = atob(encryptedText);
    const parts = decoded.split(':');
    
    if (parts.length !== 2 || parts[0] !== algorithm) {
      throw new Error('Invalid algorithm or format');
    }
    
    return parts[1].split('').map((char) => {
      const charCode = char.charCodeAt(0);
      const passwordChar = password.charCodeAt(0);
      return String.fromCharCode(charCode - passwordChar);
    }).join('');
  } catch (error) {
    throw new Error('Decryption failed. Check your password and try again.');
  }
}

/**
 * Encrypts a file and returns a downloadable blob URL
 */
export async function encryptFile(file: File, password: string, algorithm: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const fileContent = event.target?.result as string;
        const fileName = file.name;
        const fileType = file.type;
        
        // Create a JSON object with file metadata and content
        const fileData = JSON.stringify({
          name: fileName,
          type: fileType,
          content: fileContent
        });
        
        // Encrypt the file data
        const encrypted = encrypt(fileData, password, algorithm);
        
        // Create a Blob from the encrypted data
        const blob = new Blob([encrypted], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        
        resolve(url);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Decrypts a file and returns a downloadable blob URL
 */
export async function decryptFile(file: File, password: string, algorithm: string): Promise<{ url: string, fileName: string, fileType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const encryptedContent = event.target?.result as string;
        const decrypted = decrypt(encryptedContent, password, algorithm);
        
        // Parse the decrypted JSON data
        const fileData = JSON.parse(decrypted);
        
        // Extract file metadata and content
        const fileName = fileData.name;
        const fileType = fileData.type;
        const fileContent = fileData.content;
        
        // Create a Blob and URL for download
        const contentType = fileType || 'application/octet-stream';
        const blob = new Blob([fileContent], { type: contentType });
        const url = URL.createObjectURL(blob);
        
        resolve({ url, fileName, fileType });
      } catch (error) {
        reject(new Error('Decryption failed. Check your password and try again.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}