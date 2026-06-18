const LANGUAGE_IDS = {
    javascript: 63,  
    python: 71,     
    cpp: 54,        
    java: 62,         
    typescript: 74,   
    go: 60,          
    rust: 73,        
    html: 63,         
    css: 63,         
    sql: 82,         
  }

  const JUDGE0_STATUS = {
    1: 'In Queue',
    2: 'Processing',
    3: 'Accepted',         
    4: 'Wrong Answer',
    5: 'Time Limit Exceeded',
    6: 'Compilation Error',
    7: 'Runtime Error (SIGSEGV)',
    8: 'Runtime Error (SIGXFSZ)',
    9: 'Runtime Error (SIGFPE)',
    10: 'Runtime Error (SIGABRT)',
    11: 'Runtime Error (NZEC)',
    12: 'Runtime Error (Other)',
    13: 'Internal Error',
    14: 'Exec Format Error',
  }
  
  const getLanguageId = (language) => {
    return LANGUAGE_IDS[language] || 63 
  }
  
  const getStatusMessage = (statusId) => {
    return JUDGE0_STATUS[statusId] || 'Unknown Status'
  }
  
  module.exports = { getLanguageId, getStatusMessage, LANGUAGE_IDS }