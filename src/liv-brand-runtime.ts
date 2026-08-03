import './liv-brand-system.css';
import './liv-brand-final.css';
import './viktor-brand-final.css';
import './resource-brand-final.css';
import './economy-brand-final.css';
import{startFinancialActivityEnhancer}from'./financial-activity-enhancer';
import{startFinancialTransactionEnhancer}from'./financial-transaction-enhancer';
import{startFinancialReconciliationEnhancer}from'./financial-reconciliation-enhancer';
import{startReceiptBulkImportEnhancer}from'./receipt-bulk-import-enhancer';
import{startFinancialSpendOverviewEnhancer}from'./financial-spend-overview-enhancer';
import{startFinancialCategoryOptionsEnhancer}from'./financial-category-options-enhancer';
import{startFinancialLiveDashboardEnhancer}from'./financial-live-dashboard-enhancer';
import{startEconomyWorkspaceNavigation}from'./economy-workspace-navigation';
import{startReceiptListNavigation}from'./receipt-list-navigation';

/**
 * LIV and Studio are two experiences inside the same React application.
 * Keep one canonical brand cascade and expose the active experience at the
 * application root so shared styling never depends on a feature component's
 * private class names.
 */
function synchroniseExperience(): void {
  const shell = document.querySelector<HTMLElement>('.u-shell');
  if (!shell) return;

  const experience = shell.querySelector('.u-sidebar.studio-sidebar') ? 'studio' : 'liv';
  shell.dataset.livExperience = experience;
  document.documentElement.dataset.livExperience = experience;
  document.body.dataset.livExperience = experience;
}

function startBrandRuntime(): void {
  synchroniseExperience();
  startFinancialLiveDashboardEnhancer();
  startFinancialSpendOverviewEnhancer();
  startFinancialCategoryOptionsEnhancer();
  startFinancialActivityEnhancer();
  startFinancialTransactionEnhancer();
  startFinancialReconciliationEnhancer();
  startReceiptBulkImportEnhancer();
  startEconomyWorkspaceNavigation();
  startReceiptListNavigation();

  const root = document.getElementById('root');
  if (!root) return;

  const observer = new MutationObserver(synchroniseExperience);
  observer.observe(root, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class'],
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startBrandRuntime, { once: true });
} else {
  startBrandRuntime();
}
