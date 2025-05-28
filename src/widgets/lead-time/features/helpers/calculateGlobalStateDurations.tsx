import { IIssueWithActivity, IIssueExtendedHours } from "../../interfaces";

export function calculateGlobalStateDurations(issue: IIssueWithActivity): IIssueExtendedHours {
    const leadTime: Record<string, number> = {};

    // Сохраняем время окончания для каждого статуса
    let lastTimestamp = issue.created; // Время окончания предыдущего статуса

    for (const activity of issue.activitiesGlobalState) {
        // Временная метка для текущей итерации
        const currentTimestamp = activity.timestamp;

        if (activity.removed.length > 0) {
            const duration = currentTimestamp - lastTimestamp;
                leadTime[activity.removed[0].id] = (leadTime[activity.removed[0].id] || 0) + duration;
            // Обновляем текущий статус и время
            lastTimestamp = currentTimestamp; // Обновляем время последнего действия
        }

        
    }

    return {
        ...issue,
        hours: Object.fromEntries(
            Object.entries(leadTime).map(([key, value]) => [key, value]) // Конвертация из миллисекунд в часы
        ),
        activitiesGlobalState: undefined
    }
}
