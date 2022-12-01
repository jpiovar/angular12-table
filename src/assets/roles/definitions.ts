export const userRoles = {
    'Readers': {
        value: 'per-access-dwh-rating-reader',
        description: 'Read only users'
    },
    'TraceUsers': {
        value: 'per-access-dwh-rating-trace-reader',
        description: 'User allowed to view content'
    },
    'RiskAssessments': {
        value: 'per-access-dwh-rating-risk-assessment',
        description: 'Users allowed to setup values'
    }
};

export const availableRoles = [userRoles.Readers.value, userRoles.RiskAssessments.value, userRoles.TraceUsers.value];
