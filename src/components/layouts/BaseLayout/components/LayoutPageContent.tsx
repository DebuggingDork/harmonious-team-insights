import { LayoutPageContentProps } from "../types";

/**
 * LayoutPageContent Component
 *
 * Wrapper for page content that provides consistent padding and
 * optional header with title, description, and action buttons.
 *
 * @example
 * ```tsx
 * <LayoutPageContent
 *   headerTitle="Users"
 *   headerDescription="Manage system users"
 *   headerActions={<Button>Add User</Button>}
 * >
 *   <UsersList />
 * </LayoutPageContent>
 * ```
 */
export const LayoutPageContent = ({
  headerTitle,
  headerDescription,
  headerActions,
  children,
}: LayoutPageContentProps) => {
  return (
    <div className="p-6">
      {(headerTitle || headerDescription || headerActions) && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {headerTitle && (
              <h1 className="text-2xl font-bold text-foreground">
                {headerTitle}
              </h1>
            )}
            {headerActions && <div>{headerActions}</div>}
          </div>
          {headerDescription && (
            <p className="text-muted-foreground">{headerDescription}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};
