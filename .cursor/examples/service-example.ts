/**
 * API 服务函数示例
 * 
 * 展示如何正确使用 request 工具调用 API
 * 此文件仅作为参考示例，不会被实际使用
 * 
 * 注意：以下代码中的导入语句在实际项目中会正确解析
 * 实际使用时，取消注释并确保路径别名 @/ 已配置
 */

// 实际使用时取消注释：
// import request from '@/utils/request';
// import type { ApiResponse, UserInfo, PaginationParams, PaginatedResponse } from '@/types';

/**
 * 获取用户列表
 * 
 * @example
 * ```typescript
 * import request from '@/utils/request';
 * import type { ApiResponse, UserInfo, PaginationParams } from '@/types';
 * 
 * export async function getUserList(
 *   params?: PaginationParams
 * ): Promise<UserInfo[]> {
 *   const { promise } = request.get<ApiResponse<UserInfo[]>>('/api/users', {
 *     params,
 *   });
 *   const response = await promise;
 *   
 *   if (response.data.code !== 0) {
 *     throw new Error(response.data.msg);
 *   }
 *   
 *   return response.data.data || [];
 * }
 * ```
 */

/**
 * 获取用户详情
 * 
 * @example
 * ```typescript
 * export async function getUserById(id: number): Promise<UserInfo> {
 *   const { promise } = request.get<ApiResponse<UserInfo>>(`/api/users/${id}`);
 *   const response = await promise;
 *   
 *   if (response.data.code !== 0) {
 *     throw new Error(response.data.msg);
 *   }
 *   
 *   if (!response.data.data) {
 *     throw new Error('用户不存在');
 *   }
 *   
 *   return response.data.data;
 * }
 * ```
 */

/**
 * 创建用户
 * 
 * @example
 * ```typescript
 * export async function createUser(userData: {
 *   name: string;
 *   email: string;
 *   role?: string;
 * }): Promise<{ id: number }> {
 *   const { promise } = request.post<ApiResponse<{ id: number }>>(
 *     '/api/users',
 *     userData
 *   );
 *   const response = await promise;
 *   
 *   if (response.data.code !== 0) {
 *     throw new Error(response.data.msg);
 *   }
 *   
 *   if (!response.data.data) {
 *     throw new Error('创建失败');
 *   }
 *   
 *   return response.data.data;
 * }
 * ```
 */

/**
 * 更新用户
 * 
 * @example
 * ```typescript
 * export async function updateUser(
 *   id: number,
 *   userData: Partial<Pick<UserInfo, 'name' | 'email' | 'role'>>
 * ): Promise<void> {
 *   const { promise } = request.put<ApiResponse<void>>(
 *     `/api/users/${id}`,
 *     userData
 *   );
 *   const response = await promise;
 *   
 *   if (response.data.code !== 0) {
 *     throw new Error(response.data.msg);
 *   }
 * }
 * ```
 */

/**
 * 删除用户
 * 
 * @example
 * ```typescript
 * export async function deleteUser(id: number): Promise<void> {
 *   const { promise } = request.delete<ApiResponse<void>>(`/api/users/${id}`);
 *   const response = await promise;
 *   
 *   if (response.data.code !== 0) {
 *     throw new Error(response.data.msg);
 *   }
 * }
 * ```
 */

/**
 * 获取分页用户列表
 * 
 * @example
 * ```typescript
 * export async function getUserListPaginated(
 *   params: PaginationParams
 * ): Promise<PaginatedResponse<UserInfo>> {
 *   const { promise } = request.get<PaginatedResponse<UserInfo>>('/api/users', {
 *     params,
 *   });
 *   const response = await promise;
 *   
 *   if (response.data.code !== 0) {
 *     throw new Error(response.data.msg);
 *   }
 *   
 *   return response.data;
 * }
 * ```
 */
