// Utilitário para gerenciamento de grupos no Fractal Creator
// Responsável por operações CRUD e lógica de manipulação de grupos

/**
 * Cria um novo grupo
 * @param {Object} options - Opções do grupo
 * @param {String} options.name - Nome do grupo (opcional, gera automático se não fornecido)
 * @param {String} options.color - Cor do grupo (opcional, usa cor aleatória se não fornecido)
 * @param {Array} options.children - IDs dos elementos filhos (opcional)
 * @returns {Object} - Novo objeto de grupo criado
 */
export function createGroup(options = {}) {
  // Gera ID único para o grupo
  const id = `group-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  
  // Determina o nome (automático ou fornecido)
  const name = options.name || `Grupo ${Math.floor(Math.random() * 1000)}`;
  
  // Determina a cor (aleatória ou fornecida)
  const color = options.color || getRandomColor();
  
  // Cria o objeto de grupo
  return {
    id,
    name,
    color,
    children: options.children || [],
    visible: true,
    locked: false,
    expanded: true,
    transformMatrix: [1, 0, 0, 1, 0, 0], // Identidade por padrão [a, b, c, d, tx, ty]
    createdAt: Date.now(),
  };
}

/**
 * Deleta um grupo
 * @param {Array} groups - Lista atual de grupos
 * @param {String} groupId - ID do grupo a ser removido
 * @param {Boolean} orphanChildren - Se true, mantém os filhos sem grupo; se false, remove filhos também
 * @returns {Object} - { groups: Array atualizado de grupos, affectedElements: Array de IDs de elementos afetados }
 */
export function deleteGroup(groups, groupId, orphanChildren = true) {
  // Encontra o grupo para saber seus filhos
  const targetGroup = groups.find(g => g.id === groupId);
  
  if (!targetGroup) {
    return { groups, affectedElements: [] };
  }
  
  const affectedElements = [...targetGroup.children];

  // Remove o grupo da lista
  const updatedGroups = groups.filter(g => g.id !== groupId);
  
  return { groups: updatedGroups, affectedElements };
}

/**
 * Adiciona um elemento filho ao grupo
 * @param {Array} groups - Lista atual de grupos
 * @param {String} groupId - ID do grupo
 * @param {String|Array} childId - ID do elemento ou array de IDs a serem adicionados
 * @returns {Array} - Lista atualizada de grupos
 */
export function addChildToGroup(groups, groupId, childId) {
  return groups.map(group => {
    if (group.id === groupId) {
      const childIds = Array.isArray(childId) ? childId : [childId];
      // Verifica se os filhos já existem para evitar duplicação
      const newChildren = [...new Set([...group.children, ...childIds])];
      
      return {
        ...group,
        children: newChildren
      };
    }
    return group;
  });
}

/**
 * Remove um elemento filho do grupo
 * @param {Array} groups - Lista atual de grupos
 * @param {String} groupId - ID do grupo
 * @param {String} childId - ID do elemento a ser removido
 * @returns {Array} - Lista atualizada de grupos
 */
export function removeChildFromGroup(groups, groupId, childId) {
  return groups.map(group => {
    if (group.id === groupId) {
      return {
        ...group,
        children: group.children.filter(id => id !== childId)
      };
    }
    return group;
  });
}

/**
 * Busca um grupo por ID
 * @param {Array} groups - Lista de grupos
 * @param {String} groupId - ID do grupo a buscar
 * @returns {Object|null} - Grupo encontrado ou null
 */
export function getGroupById(groups, groupId) {
  return groups.find(g => g.id === groupId) || null;
}

/**
 * Atualiza propriedades de um grupo
 * @param {Array} groups - Lista atual de grupos
 * @param {String} groupId - ID do grupo a ser atualizado
 * @param {Object} props - Novas propriedades para o grupo
 * @returns {Array} - Lista atualizada de grupos
 */
export function updateGroup(groups, groupId, props) {
  return groups.map(group => {
    if (group.id === groupId) {
      return {
        ...group,
        ...props
      };
    }
    return group;
  });
}

/**
 * Encontra todos os grupos que contêm um elemento
 * @param {Array} groups - Lista de grupos
 * @param {String} elementId - ID do elemento
 * @returns {Array} - Lista de IDs dos grupos que contêm o elemento
 */
export function findGroupsContainingElement(groups, elementId) {
  return groups
    .filter(group => group.children.includes(elementId))
    .map(group => group.id);
}

/**
 * Cria um grupo a partir da seleção de elementos
 * @param {Array} elements - Array de elementos selecionados (shapes ou linhas)
 * @param {Object} options - Opções adicionais para o grupo
 * @returns {Object} - Novo objeto de grupo
 */
export function createGroupFromSelection(elements, options = {}) {
  if (!elements || elements.length === 0) {
    return null;
  }

  // Extrai os IDs dos elementos selecionados
  const elementIds = elements.map(elem => elem.id);

  // Cria um nome automático baseado na quantidade de elementos
  const defaultName = `Grupo de ${elements.length} ${elements.length === 1 ? 'elemento' : 'elementos'}`;
  
  // Cria o novo grupo com os elementos selecionados
  return createGroup({
    name: options.name || defaultName,
    color: options.color,
    children: elementIds
  });
}

/**
 * Move um elemento de um grupo para outro
 * @param {Array} groups - Lista atual de grupos
 * @param {String} elementId - ID do elemento
 * @param {String} sourceGroupId - ID do grupo de origem
 * @param {String} targetGroupId - ID do grupo de destino
 * @returns {Array} - Lista atualizada de grupos
 */
export function moveElementBetweenGroups(groups, elementId, sourceGroupId, targetGroupId) {
  // Primeiro remove do grupo de origem
  let updatedGroups = removeChildFromGroup(groups, sourceGroupId, elementId);
  
  // Depois adiciona ao grupo de destino
  updatedGroups = addChildToGroup(updatedGroups, targetGroupId, elementId);
  
  return updatedGroups;
}

/**
 * Verifica se há elementos em um grupo
 * @param {Object} group - Objeto do grupo
 * @returns {Boolean} - True se o grupo tiver elementos
 */
export function hasChildren(group) {
  return group && group.children && group.children.length > 0;
}

/**
 * Obtém todos os elementos de um grupo, incluindo elementos em subgrupos
 * @param {Array} groups - Lista de grupos
 * @param {String} groupId - ID do grupo
 * @returns {Array} - IDs de todos os elementos no grupo e subgrupos
 */
export function getAllGroupElementIds(groups, groupId) {
  const group = getGroupById(groups, groupId);
  if (!group) return [];
  
  let allElements = [...group.children];
  
  // Busca recursivamente elementos em subgrupos (implementação futura)
  // Este é um placeholder para quando tivermos hierarquia de grupos
  
  return allElements;
}

/**
 * Gera uma cor aleatória em formato hexadecimal
 * @returns {String} - Cor hexadecimal
 */
function getRandomColor() {
  const colors = [
    '#4CC674', // Verde principal
    '#63B3ED', // Azul
    '#F687B3', // Rosa
    '#9F7AEA', // Roxo
    '#ED8936', // Laranja
    '#ECC94B', // Amarelo
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
}
