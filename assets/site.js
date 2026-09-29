(() => {
  document.querySelectorAll('[data-publications]').forEach(scope => {
    scope.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      scope.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      scope.querySelectorAll('[data-publication-group]').forEach(group => {
        group.hidden = filter !== 'all' && group.dataset.publicationGroup !== filter;
      });
      let count = 0;
      scope.querySelectorAll('.pub-list .pub').forEach(paper => {
        paper.hidden = filter !== 'all' && paper.dataset.type !== filter;
        if (!paper.hidden) count++;
      });
      const status = scope.querySelector('[data-filter-status]');
      if (status) status.textContent = `${count} ${count === 1 ? 'paper' : 'papers'} shown`;
    }));
  });
  document.querySelectorAll('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));
})();
