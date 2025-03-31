import React, { useState, useEffect } from 'react';

const Options = () => {
  const [rules, setRules] = useState<{selector:string}[]>([]);
  const [newRule, setNewRule] = useState('');

  useEffect(() => {
    chrome.storage.local.get('customRules', (data) => {
      setRules(data.customRules || []);
    });
  }, []);

  const addRule = () => {
    if (newRule) {
      const updatedRules = [...rules, { selector: newRule }];
      chrome.storage.local.set({ customRules: updatedRules });
      setRules(updatedRules);
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    const updatedRules = rules.filter((_, i) => i !== index);
    chrome.storage.local.set({ customRules: updatedRules });
    setRules(updatedRules);
  };

  return (
    <div>
      <h2>Manage Custom Rules</h2>
      <input type="text" value={newRule} onChange={(e) => setNewRule(e.target.value)} />
      <button onClick={addRule}>Add Rule</button>
      <ul>
        {rules.map((rule, index) => (
          <li key={index}>{rule.selector} <button onClick={() => removeRule(index)}>Remove</button></li>
        ))}
      </ul>
    </div>
  );
};

export default Options;