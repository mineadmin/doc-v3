# Data Permission Configuration and Usage Examples

This article explains the configuration and usage methods of various strategies in data permission settings.

## Data Isolation Methods

Currently, data isolation only supports row-level isolation but offers multiple isolation strategies.

It is primarily divided into isolation methods based on the creator and the department.

* **Department** isolation uses the user's current department as the basis, automatically adding department filter conditions when querying data.
* **Creator** isolation uses the data creator as the basis, automatically adding creator filter conditions when querying data.

## Priority

Currently, two methods are supported:
1. **Setting isolation policies for specific users**
2. **Assigning positions to users and setting isolation policies for those positions**

If a user has both an isolation policy and a position-based isolation policy, the user-specific isolation policy takes precedence.

```plantuml
@startuml
title Retrieve Data Isolation Policy
start
:Get current user policy;
if (User has isolation policy) then (yes)
    :Return user isolation policy;
else (no)
    :Get position isolation policy;
    if (Position has isolation policy) then (yes)
        :Return position isolation policy;
    endif
endif

if(If no isolation policy found) then (yes)
    :Return empty policy;
endif

end

@enduml
```

The logic code is as follows:

```php
// app/Model/Permission/User.php:167~186

public function getPolicy(): ?Policy
{
    /**
     * @var null|Policy $policy
     */
    $policy = $this->policy()->first();
    if (! empty($policy)) {
        return $policy;
    }

    $this->load('position');
    $positionList = $this->position;
    foreach ($positionList as $position) {
        $current = $position->policy()->first();
        if (! empty($current)) {
            return $current;
        }
    }
    return null;
}

```

## Examples

Using the current `user` table as the isolation table, assume the following data:

### Sample Data

Department Table

---

| id | name | parent_id |
|----|------|-----------|
| 1  | Dept1 | 0         |
| 2  | Dept2 | 1         |
| 3  | Dept3 | 0         |

Dept1 is a top-level department with no parent.
Dept2 is a sub-department of Dept1.
Dept3 is a top-level department with no parent.

---

Position Table

| id | name | dept_id |
|----|------|---------|
| 1  | Position1 | 1       |
| 2  | Position2 | 2       |
| 3  | Position3 | 3       |

Dept1 has Position1, Dept2 has Position2, and Dept3 has Position3.

---

User Table

| id | name  | dept_id | created_by | post_id |
|----|-------|---------|------------|---------|
| 1  | Super Admin | 0       | 0          | 0       |
| 2  | a1    | 1       | 1          | 1       |
| 3  | a2    | 2       | 1          | 1       |
| 4  | a3    | 1       | 2          | 2       |
| 5  | a4    | 2       | 2          | 0       |
| 6  | a5    | 0       | 4          | 0       |

In the user table, `dept_id` 0 indicates no department, and `created_by` 0 indicates no creator.
The super admin can view all data.

a1 and a3 belong to Dept1; a2 and a4 belong to Dept2.

a1 and a2 were created by the super admin; a3 and a4 were created by a1.

a1 and a2 hold Position1; a3 holds Position2; a4 has no position.

Below are examples illustrating query results under different policies.

### PolicyType::SELF `Query Only Own Data`

Assume the current user is a1 (ID 2) with a "query only own data" policy.

1. Isolation method: Only by creator. The query condition will be `created_by = current user ID`, i.e., users a3 and a4.

```sql
SELECT * FROM user WHERE created_by in (4,5);
```

2. Isolation method: Only by department. The query condition will be `dept_id = current user's department`, i.e., users a1 and a3.

```sql
SELECT * FROM user WHERE dept_id in(1);
```

3. Isolation method: By creator and department. The query condition will be `created_by = current user ID` AND `dept_id = current user's department`, i.e., user a3.

```sql
SELECT * FROM user WHERE created_by in(2) AND dept_id in(1);
```

4. Isolation method: By department OR creator. The query condition will be `created_by = current user ID` OR `dept_id = current user's department`, i.e., users a1, a3, and a4.

```sql
SELECT * FROM user WHERE dept_id in(1) OR created_by in(2);
```

### PolicyType::DEPT_SELF `Query Only Own Department`

Assume the current user is a1 (ID 2) with a "query only own department" policy.

1. Isolation method: Only by creator. The query condition will be `created_by = IDs of all users in the same department`, i.e., users a3, a4, and a5.

```sql
SELECT * FROM user WHERE created_by in (2,4,5);
```

2. Isolation method: Only by department. The query condition will be `dept_id = current user's department`, i.e., users a1 and a3.

```sql
SELECT * FROM user WHERE dept_id in(1);
```

3. Isolation method: By creator and department. The query condition will be `created_by = IDs of all users in the same department` AND `dept_id = current user's department`, i.e., user a3.

```sql
SELECT * FROM user WHERE created_by in(2,4,5) AND dept_id in(1);
```

4. Isolation method: By department OR creator. The query condition will be `created_by = IDs of all users in the same department` OR `dept_id = current user's department`, i.e., users a1, a3, a4, and a5.

```sql
SELECT * FROM user WHERE created_by in(2,4,5) OR dept_id in(1);
```

### PolicyType::DEPT_TREE `Query Own Department and Sub-Departments`

Assume the current user is a1 (ID 2) with a "query own department and sub-departments" policy.

1. Isolation method: Only by creator. The query condition will be `created_by = IDs of all users in the same and sub-departments`, i.e., users a3, a4, and a5.

```sql
SELECT * FROM user WHERE created_by in (2,4,5);
```

2. Isolation method: Only by department. The query condition will be `dept_id = current user's department and sub-departments`, i.e., users a1, a2, a3, and a4.

```sql
SELECT * FROM user WHERE dept_id in(1,2);
```

3. Isolation method: By creator and department. The query condition will be `created_by = IDs of all users in the same and sub-departments` AND `dept_id = current user's department and sub-departments`, i.e., users a3 and a4.

```sql
SELECT * FROM user WHERE created_by in(2,4,5) AND dept_id in(1,2);
```

4. Isolation method: By department OR creator. The query condition will be `created_by = IDs of all users in the same and sub-departments` OR `dept_id = current user's department and sub-departments`, i.e., users a1, a2, a3, a4, and a5.

```sql
SELECT * FROM user WHERE created_by in(2,4,5) OR dept_id in(1,2);
```

### PolicyType::ALL `Query All Data`
Assume the current user is a1 (ID 2) with a "query all data" policy. All restrictions will be lifted.

### PolicyType::CUSTOM_DEPT `Custom Departments`

Assume the current user is a1 (ID 2) with a policy allowing only access to data from departments 2 and 3.

1. Isolation method: Only by creator. The query condition will be `created_by = IDs of all users in departments 2 and 3`, i.e., users a2, a4, and a5.

```sql
SELECT * FROM user WHERE created_by in (2,4,5);
```

2. Isolation method: Only by department. The query condition will be `dept_id = 2 and 3`, i.e., users a2 and a4.

```sql
SELECT * FROM user WHERE dept_id in(2,3);
```

3. Isolation method: By creator and department. The query condition will be `created_by = IDs of all users in departments 2 and 3` AND `dept_id = 2 and 3`, i.e., users a2 and a4.

```sql
SELECT * FROM user WHERE created_by in(2,4,5) AND dept_id in(2,3);
```

4. Isolation method: By department OR creator. The query condition will be `created_by = IDs of all users in departments 2 and 3` OR `dept_id = 2 and 3`, i.e., users a2, a4, and a5.

```sql
SELECT * FROM user WHERE created_by in(2,4,5) OR dept_id in(2,3);
```

### PolicyType::CUSTOM_FUNC `Custom Function`

Assume the current user is a1 (ID 2) with a policy using the custom function `testction`.

In `config/autoload/department/custom.php`, the custom function `testction` is defined:

```php
<?php

declare(strict_types=1);
/**
 * This file is part of MineAdmin.
 *
 * @link     https://www.mineadmin.com
 * @document https://doc.mineadmin.com
 * @contact  root@imoi.cn
 * @license  https://github.com/mineadmin/MineAdmin/blob/master/LICENSE
 */

use App\Library\DataPermission\Context;
use App\Library\DataPermission\ScopeType;
use App\Model\DataPermission\Policy;
use App\Model\Permission\User;
use Hyperf\Database\Query\Builder;

return [
    'testction' =>  function (Builder $builder, ScopeType $scopeType, Policy $policy, User $user) {
        // Only applies to user with ID 2
        if ($user->id !== 2) {
            return;
        }
        // Get the creator column name from the current context
        $createdByColumn = Context::getCreatedByColumn();
        // Get the department column name from the current context
        $deptColumn = Context::getDeptColumn();
        switch ($scopeType){
            // Isolation type: By creator
            case ScopeType::CREATED_BY:
                // Creator column equals current user
                $builder->where($createdByColumn, $user->id);
                break;
            case ScopeType::DEPT:
                // Department column equals current user's department
                $builder->whereIn($deptColumn, $user->department()->get()->pluck('id'));
                break;
            case ScopeType::DEPT_CREATED_BY:
                // Department column equals current user's department
                $builder->whereIn($deptColumn, $user->department()->get()->pluck('id'));
                // Creator equals current user
                $builder->where($createdByColumn, $user->id);
                break;
            case ScopeType::DEPT_OR_CREATED_BY:
                // Department column equals current user's department
                $builder->whereIn($deptColumn, $user->department()->get()->pluck('id'));
                // Creator equals current user
                $builder->orWhere($createdByColumn, $user->id);
                break;
        }
    }
];

```

When isolation is active, the current context's user, isolation method, and permission policy are passed to the custom function `testction` for processing, allowing developers to implement complex isolation logic.