import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const setSelectedUserContext = (user) => {
    setSelectedUser(user);
  };

  // 3. Forneça o contexto em torno do componente
  return (
    <SearchContext.Provider value={{ selectedUser, setSelectedUserContext }}>
      {children}
    </SearchContext.Provider>
  );
};

// 4. Crie um hook para consumir o contexto
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};
